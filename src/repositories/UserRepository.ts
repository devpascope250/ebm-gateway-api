import { BaseRepository } from './BaseRepository';
import { User, UserCreateInput, UserUpdateInput } from '../models/User';

export class UserRepository extends BaseRepository {
  private tableName = 'users';

  async findAll(): Promise<User[]> {
    const sql = `SELECT * FROM ${this.tableName} WHERE deleted_at IS NULL`;
    return await this.query<User[]>(sql);
  }

  async findById(id: number): Promise<User | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = :id AND deleted_at IS NULL`;
    const results = await this.queryNamed<User[]>(sql, { id });
    return results[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE email = :email AND deleted_at IS NULL`;
    const results = await this.queryNamed<User[]>(sql, { email });
    return results[0] || null;
  }

  async create(userData: UserCreateInput): Promise<number> {
    const sql = `INSERT INTO ${this.tableName} (name, email) VALUES (:name, :email)`;
    const result = await this.queryNamed<{ insertId: number }>(sql, {
      name: userData.name,
      email: userData.email
    });
    return result.insertId;
  }

  async update(id: number, userData: UserUpdateInput): Promise<boolean> {
    const updates: string[] = [];
    const params: any = { id };

    if (userData.name) {
      updates.push('name = :name');
      params.name = userData.name;
    }
    if (userData.email) {
      updates.push('email = :email');
      params.email = userData.email;
    }

    if (updates.length === 0) {
      return false;
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    const sql = `UPDATE ${this.tableName} SET ${updates.join(', ')} WHERE id = :id`;
    const result = await this.queryNamed<{ affectedRows: number }>(sql, params);
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const sql = `UPDATE ${this.tableName} SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id`;
    const result = await this.queryNamed<{ affectedRows: number }>(sql, { id });
    return result.affectedRows > 0;
  }


  // Example of complex query with multiple conditions
  async findUsersByCriteria(criteria: {
    name?: string;
    email?: string;
    createdAfter?: Date;
    isActive?: boolean;
  }): Promise<User[]> {
    const conditions: string[] = [];
    const params: any = {};

    if (criteria.name) {
      conditions.push('name LIKE :name');
      params.name = `%${criteria.name}%`;
    }
    if (criteria.email) {
      conditions.push('email = :email');
      params.email = criteria.email;
    }
    if (criteria.createdAfter) {
      conditions.push('created_at > :createdAfter');
      params.createdAfter = criteria.createdAfter;
    }
    if (criteria.isActive !== undefined) {
      conditions.push('is_active = :isActive');
      params.isActive = criteria.isActive;
    }

    conditions.push('deleted_at IS NULL');

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM ${this.tableName} ${whereClause}`;
    
    return await this.queryNamed<User[]>(sql, params);
  }
}