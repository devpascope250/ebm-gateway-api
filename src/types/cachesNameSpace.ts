// cache-namespace.ts
export class CacheNamespace {
  // Product related namespaces
  static items = {
    // Get products by partner
    itemsList: (tin: string, bhfId: string): [string, string] => ['products', `tin_bhfId_${tin}-${bhfId}`],
  };
  static ebmSync = {
    // EBM Sync status by tin and bhfId
    ebmSyncStatus: (tin: string, bhfId: string, entityName: string): [string, string] => ['ebm_sync', `tin_bhfId_entity_${tin}-${bhfId}-${entityName}`],
    ebmSyncByEntity: (entityName: string): [string, string] => ['ebm_sync', `entity_${entityName}`],
  };

  static imported = {
    listImported: (tin: string, bhfId: string): [string, string] => ['ListImported', `tin_bhfId_${tin}-${bhfId}`],
  };

  static purchases = {
    listPurchases: (tin: string, bhfId: string): [string, string] => ['listPurchases', `tin_bhfId_${tin}-${bhfId}`]
  };

  static noticesList = {
    listNotices: (tin: string, bhfId: string): [string, string] => ['noticesList', `tin_bhfId_${tin}-${bhfId}`]
  };
  static lockWithIdempotency = {
    getSalesIdempotencyKey: (tin: string, bhfId: string, invcNo: string): [string, string] => ['sales:lock', `tin_bhfId_${tin}-${bhfId}-${invcNo}`]
  }

  // Helper method to generate cache keys consistently
  static generateKey(namespace: string, key: string): string {
    return `${namespace}:${key}`;
  }

  // Method to parse a full key back to namespace and key
  static parseKey(fullKey: string): { namespace: string; key: string } {
    const [namespace, ...keyParts] = fullKey.split(':');
    return {
      namespace,
      key: keyParts.join(':')
    };
  }

  // Clear all cache entries for a specific namespace
  static async clearNamespace(
    namespace: string,
    cache: any // Assuming RedisCache instance
  ): Promise<boolean> {
    try {
      return await cache.delete(namespace);
    } catch (error) {
      console.error(`Failed to clear namespace ${namespace}:`, error);
      return false;
    }
  }

  // Generate cache options based on namespace type
  static getCacheOptions(namespace: string): { ttl?: number; compress?: boolean } {
    const ttlConfig: Record<string, number> = {
      'products': 3600, // 1 hour
      'ebm_sync': 86400, // 1day
    };

    const compressConfig = ['products', 'ebm_sync'];

    return {
      ttl: ttlConfig[namespace] || 600, // Default 10 minutes
      compress: compressConfig.includes(namespace)
    };
  }
}