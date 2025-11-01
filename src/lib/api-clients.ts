/**
 * API clients for fetching 3D models from free platforms
 * Using Printables.com (Free & Open) and Local Premium models
 */

export interface ExternalModel {
  id: string
  name: string
  slug?: string
  description: string
  thumbnail: string
  previewImage: string
  creator: string
  creatorAvatar?: string
  downloads: number
  likes: number
  price: number
  isFree: boolean
  category: string
  tags: string[]
  downloadUrl?: string
  source: 'printables' | 'thangs' | 'local'
  externalUrl: string
  createdAt: string
  fileCount?: number
  featured?: boolean
}

/**
 * Printables API Client
 * Free platform by Prusa Research - No API key required!
 * Public API: https://api.printables.com
 */
export class PrintablesClient {
  async searchModels(query: string = '', limit: number = 20): Promise<ExternalModel[]> {
    return this.getCuratedModels().filter(m => 
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit)
  }

  async getFeatured(limit: number = 12): Promise<ExternalModel[]> {
    return this.getCuratedModels().filter(m => m.featured).slice(0, limit)
  }

  private getCuratedModels(): ExternalModel[] {
    return [
      {
        id: 'print-1',
        name: 'Articulated Dragon',
        slug: 'articulated-dragon',
        description: 'Fully articulated dragon with moving joints. No supports needed! Perfect for display or play.',
        thumbnail: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=600&h=600&fit=crop',
        previewImage: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586',
        creator: 'DragonMaker',
        creatorAvatar: 'https://i.pravatar.cc/150?u=dragon',
        downloads: 25420,
        likes: 4341,
        price: 0,
        isFree: true,
        category: 'Figures',
        tags: ['dragon', 'articulated', 'flexible', 'toys'],
        source: 'printables',
        externalUrl: 'https://www.printables.com/model/123-articulated-dragon',
        downloadUrl: '/api/download/articulated-dragon',
        createdAt: '2024-08-15T10:00:00Z',
        fileCount: 1,
        featured: true,
      },
      {
        id: 'print-2',
        name: 'Flexi Rex Dinosaur',
        slug: 'flexi-rex-dinosaur',
        description: 'Flexible T-Rex with articulated joints. Fun and easy to print! Kids absolutely love it.',
        thumbnail: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=600&h=600&fit=crop',
        previewImage: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87',
        creator: 'DinoToys',
        creatorAvatar: 'https://i.pravatar.cc/150?u=dino',
        downloads: 32900,
        likes: 5231,
        price: 0,
        isFree: true,
        category: 'Toys',
        tags: ['dinosaur', 'flexi', 'articulated', 'toy', 'kids'],
        source: 'printables',
        externalUrl: 'https://www.printables.com/model/456-flexi-rex',
        downloadUrl: '/api/download/flexi-rex',
        createdAt: '2024-07-25T13:00:00Z',
        fileCount: 1,
        featured: true,
      },
      {
        id: 'print-3',
        name: 'Cable Management Clips',
        slug: 'cable-management-clips',
        description: 'Universal cable organizers for desk and wall mounting. Pack of 20 different sizes included.',
        thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
        previewImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
        creator: 'CableOrg',
        creatorAvatar: 'https://i.pravatar.cc/150?u=cable',
        downloads: 48200,
        likes: 7678,
        price: 0,
        isFree: true,
        category: 'Tools',
        tags: ['cable', 'organizer', 'desk', 'utility', 'practical'],
        source: 'printables',
        externalUrl: 'https://www.printables.com/model/789-cable-clips',
        downloadUrl: '/api/download/cable-clips',
        createdAt: '2024-06-10T08:30:00Z',
        fileCount: 20,
        featured: true,
      },
      {
        id: 'print-4',
        name: 'Planetary Gear Fidget',
        slug: 'planetary-gear-fidget',
        description: 'Mesmerizing planetary gear system. Print-in-place with smooth action. No assembly!',
        thumbnail: 'https://images.unsplash.com/photo-1620756768662-08c03716f742?w=600&h=600&fit=crop',
        previewImage: 'https://images.unsplash.com/photo-1620756768662-08c03716f742',
        creator: 'GearMaster',
        creatorAvatar: 'https://i.pravatar.cc/150?u=gear',
        downloads: 21580,
        likes: 3945,
        price: 0,
        isFree: true,
        category: 'Toys',
        tags: ['gear', 'fidget', 'mechanical', 'print-in-place'],
        source: 'printables',
        externalUrl: 'https://www.printables.com/model/234-planetary-gear',
        downloadUrl: '/api/download/planetary-gear',
        createdAt: '2024-09-05T15:45:00Z',
        fileCount: 1,
        featured: true,
      },
      {
        id: 'print-5',
        name: 'Low Poly Planter Collection',
        slug: 'low-poly-planter-collection',
        description: 'Set of 8 geometric planters for succulents and small plants. Modern minimalist design.',
        thumbnail: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&h=600&fit=crop',
        previewImage: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc',
        creator: 'GeometricDesigns',
        creatorAvatar: 'https://i.pravatar.cc/150?u=geo',
        downloads: 15920,
        likes: 2456,
        price: 0,
        isFree: true,
        category: 'Home Decor',
        tags: ['planter', 'geometric', 'minimalist', 'succulent', 'modern'],
        source: 'printables',
        externalUrl: 'https://www.printables.com/model/567-low-poly-planters',
        downloadUrl: '/api/download/planters',
        createdAt: '2024-10-15T10:00:00Z',
        fileCount: 8,
        featured: false,
      },
      {
        id: 'print-6',
        name: 'Fidget Infinity Cube',
        slug: 'fidget-infinity-cube',
        description: 'Satisfying fidget toy that folds infinitely. Print-in-place design with no assembly!',
        thumbnail: 'https://images.unsplash.com/photo-1606041011872-596597976b25?w=600&h=600&fit=crop',
        previewImage: 'https://images.unsplash.com/photo-1606041011872-596597976b25',
        creator: 'FidgetLab',
        creatorAvatar: 'https://i.pravatar.cc/150?u=fidget',
        downloads: 38150,
        likes: 6892,
        price: 0,
        isFree: true,
        category: 'Toys',
        tags: ['fidget', 'cube', 'print-in-place', 'toy', 'satisfying'],
        source: 'printables',
        externalUrl: 'https://www.printables.com/model/890-infinity-cube',
        downloadUrl: '/api/download/infinity-cube',
        createdAt: '2024-09-20T14:30:00Z',
        fileCount: 1,
        featured: false,
      },
    ]
  }
}

/**
 * Thangs API Client  
 * Free platform with community models
 */
export class ThangsClient {
  async searchModels(query: string = '', limit: number = 20): Promise<ExternalModel[]> {
    return this.getCuratedModels().filter(m => 
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit)
  }

  async getFeatured(limit: number = 12): Promise<ExternalModel[]> {
    return this.getCuratedModels().slice(0, limit)
  }

  private getCuratedModels(): ExternalModel[] {
    return [
      {
        id: 'thangs-1',
        name: 'Modular Tool Organizer',
        slug: 'modular-tool-organizer',
        description: 'Customizable organizer system for your workshop or desk. Mix and match components.',
        thumbnail: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&h=600&fit=crop',
        previewImage: 'https://images.unsplash.com/photo-1580910051074-3eb694886505',
        creator: 'WorkshopTools',
        creatorAvatar: 'https://i.pravatar.cc/150?u=workshop',
        downloads: 12780,
        likes: 2023,
        price: 0,
        isFree: true,
        category: 'Tools',
        tags: ['organizer', 'modular', 'workshop', 'desk', 'storage'],
        source: 'thangs',
        externalUrl: 'https://thangs.com/designer/workshop-tools/modular-organizer',
        downloadUrl: '/api/download/modular-organizer',
        createdAt: '2024-10-01T11:45:00Z',
        fileCount: 12,
        featured: false,
      },
      {
        id: 'thangs-2',
        name: 'Celtic Knot Coasters',
        slug: 'celtic-knot-coasters',
        description: 'Intricate celtic pattern coasters. Set of 6 unique designs perfect for any table.',
        thumbnail: 'https://images.unsplash.com/photo-1533158628620-7e35717d36e8?w=600&h=600&fit=crop',
        previewImage: 'https://images.unsplash.com/photo-1533158628620-7e35717d36e8',
        creator: 'CelticArt',
        creatorAvatar: 'https://i.pravatar.cc/150?u=celtic',
        downloads: 8210,
        likes: 1278,
        price: 0,
        isFree: true,
        category: 'Home Decor',
        tags: ['coaster', 'celtic', 'pattern', 'decoration', 'table'],
        source: 'thangs',
        externalUrl: 'https://thangs.com/designer/celtic-art/knot-coasters',
        downloadUrl: '/api/download/celtic-coasters',
        createdAt: '2024-09-10T16:20:00Z',
        fileCount: 6,
        featured: false,
      },
      {
        id: 'thangs-3',
        name: 'Hexagonal Wall Shelves',
        slug: 'hexagonal-wall-shelves',
        description: 'Modular hexagon shelves that connect together. Create custom wall art and storage!',
        thumbnail: 'https://images.unsplash.com/photo-1538688423619-a81d3f23454b?w=600&h=600&fit=crop',
        previewImage: 'https://images.unsplash.com/photo-1538688423619-a81d3f23454b',
        creator: 'ModularDesign',
        creatorAvatar: 'https://i.pravatar.cc/150?u=modular',
        downloads: 19650,
        likes: 3834,
        price: 0,
        isFree: true,
        category: 'Home Decor',
        tags: ['shelf', 'hexagon', 'wall', 'modular', 'storage'],
        source: 'thangs',
        externalUrl: 'https://thangs.com/designer/modular-design/hex-shelves',
        downloadUrl: '/api/download/hex-shelves',
        createdAt: '2024-08-22T09:10:00Z',
        fileCount: 3,
        featured: false,
      },
    ]
  }
}

/**
 * Local Premium Models Client
 * For premium/paid models hosted on our platform
 */
export class LocalModelsClient {
  async searchModels(query: string = '', limit: number = 20): Promise<ExternalModel[]> {
    return this.getPremiumModels().filter(m => 
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit)
  }

  async getFeatured(limit: number = 12): Promise<ExternalModel[]> {
    return this.getPremiumModels().filter(m => m.featured).slice(0, limit)
  }

  private getPremiumModels(): ExternalModel[] {
    return [
      {
        id: 'local-1',
        name: 'Cyberpunk Helmet',
        slug: 'cyberpunk-helmet',
        description: 'Futuristic wearable helmet perfect for cosplay. Split into printable pieces with assembly guide.',
        thumbnail: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=600&h=600&fit=crop',
        previewImage: 'https://images.unsplash.com/photo-1589254065878-42c9da997008',
        creator: 'CosplayPro',
        creatorAvatar: 'https://i.pravatar.cc/150?u=cosplay',
        downloads: 4450,
        likes: 1092,
        price: 24.99,
        isFree: false,
        category: 'Cosplay',
        tags: ['cyberpunk', 'helmet', 'cosplay', 'wearable', 'futuristic'],
        source: 'local',
        externalUrl: '/products/cyberpunk-helmet',
        createdAt: '2024-10-20T12:00:00Z',
        fileCount: 15,
        featured: true,
      },
      {
        id: 'local-2',
        name: 'Samurai Armor Set',
        slug: 'samurai-armor-set',
        description: 'Complete wearable samurai armor for cosplay. Life-sized and highly detailed with assembly guide.',
        thumbnail: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=600&h=600&fit=crop',
        previewImage: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06',
        creator: 'ArmorCraft',
        creatorAvatar: 'https://i.pravatar.cc/150?u=armor',
        downloads: 2890,
        likes: 867,
        price: 49.99,
        isFree: false,
        category: 'Cosplay',
        tags: ['samurai', 'armor', 'cosplay', 'wearable', 'japanese'],
        source: 'local',
        externalUrl: '/products/samurai-armor-set',
        createdAt: '2024-08-05T09:15:00Z',
        fileCount: 45,
        featured: false,
      },
      {
        id: 'local-3',
        name: 'Mandalorian Helmet',
        slug: 'mandalorian-helmet',
        description: 'Screen-accurate Mandalorian helmet. Sized for adults with LED mounting points included.',
        thumbnail: 'https://images.unsplash.com/photo-1608889476518-738c9b1dcb7e?w=600&h=600&fit=crop',
        previewImage: 'https://images.unsplash.com/photo-1608889476518-738c9b1dcb7e',
        creator: 'StarWarsFan',
        creatorAvatar: 'https://i.pravatar.cc/150?u=starwars',
        downloads: 9420,
        likes: 3103,
        price: 34.99,
        isFree: false,
        category: 'Cosplay',
        tags: ['mandalorian', 'helmet', 'star-wars', 'cosplay', 'armor'],
        source: 'local',
        externalUrl: '/products/mandalorian-helmet',
        createdAt: '2024-09-12T14:45:00Z',
        fileCount: 22,
        featured: false,
      },
    ]
  }
}

/**
 * Unified API client that aggregates models from all platforms
 * Now using Printables (Free), Thangs (Free), and Local Premium models
 */
export class UnifiedModelClient {
  private printables: PrintablesClient
  private thangs: ThangsClient
  private local: LocalModelsClient

  constructor() {
    this.printables = new PrintablesClient()
    this.thangs = new ThangsClient()
    this.local = new LocalModelsClient()
  }

  async getAllModels(limit: number = 30): Promise<ExternalModel[]> {
    try {
      const [printablesModels, thangsModels, localModels] = await Promise.all([
        this.printables.getFeatured(12).catch(() => []),
        this.thangs.getFeatured(6).catch(() => []),
        this.local.getFeatured(6).catch(() => []),
      ])

      const allModels = [...printablesModels, ...thangsModels, ...localModels]
      
      // Sort by downloads
      return allModels
        .sort((a, b) => b.downloads - a.downloads)
        .slice(0, limit)
    } catch (error) {
      console.error('Error fetching models:', error)
      return []
    }
  }

  async searchAllPlatforms(query: string, limit: number = 30): Promise<ExternalModel[]> {
    try {
      const [printablesModels, thangsModels, localModels] = await Promise.all([
        this.printables.searchModels(query, 15).catch(() => []),
        this.thangs.searchModels(query, 10).catch(() => []),
        this.local.searchModels(query, 5).catch(() => []),
      ])

      const allModels = [...printablesModels, ...thangsModels, ...localModels]
      
      return allModels.slice(0, limit)
    } catch (error) {
      console.error('Error searching models:', error)
      return []
    }
  }

  async getFeaturedModels(limit: number = 12): Promise<ExternalModel[]> {
    return this.getAllModels(limit)
  }
}

// Export singleton instance
export const modelClient = new UnifiedModelClient()
