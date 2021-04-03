db.createUser({
  user: 'api',
  pwd: 'api',
  roles: [{
    role: 'readWrite',
    db: 'EDCM'
  }]
});
db.createCollection('stations', {
  capped: false,
  validator: {
    $jsonSchema: {
      required: ['stationName', 'systemName', 'timestamp'],
      properties: {
        stationName: {
          bsonType: 'string',
          description: 'Must be non-null string'
        },
        systemName: {
          bsonType: 'string',
          description: 'Must be non-null string'
        },
        timestamp: {
          bsonType: 'date',
          description: 'Must be non-null date timestamp'
        },
        commodities: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            required: ['name', 'category'],
            description: 'Array of commodities at station',
            properties: {
              name: {
                bsonType: 'string',
                description: 'Must be non-null string'
              },
              category: {
                bsonType: 'string',
                description: 'Must be non-null string'
              },
              buyPrice: {
                bsonType: 'int',
                description: 'Buy price at station. 0 if no commodity available'
              },
              sellPrice: {
                bsonType: 'int',
                description: 'Sell price at station. 0 if no data available'
              },
              stock: {
                bsonType: 'int',
                description: 'Stock at station'
              },
              demand: {
                bsonType: 'int',
                description: 'Demand at station'
              }
            }
          }
        },
        'economies': {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            required: ['name', 'proportion'],
            properties: {
              name: {
                bsonType: 'string',
                description: 'Name of economy'
              },
              category: {
                bsonType: 'string',
                description: 'Category of economy'
              }
            }
          }
        },
        prohibited: {
          bsonType: 'array',
          description: 'Prohibited commodities',
          items: {
            bsonType: 'string',
            description: 'Commodity name'
          }
        }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error',
  collation: {
    locale: 'en',
    caseLevel: false,
    strength: 1,

    numericOrdering: true,
    maxVariable: 'punct'
  }
});