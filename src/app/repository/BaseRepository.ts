import winston from 'winston';
import { ElasticsearchTransportOptions } from 'winston-elasticsearch';
import { Client } from '@elastic/elasticsearch';
import winstonElasticsearch from 'winston-elasticsearch';




export default class BaseRepository{
    _loggerClient: Client
    _logger:winston.Logger
    constructor() {
        this._loggerClient = new Client({
            node: 'http://elasticsearch:9200',  // Elasticsearch URL
        });
        const esTransportOpts: ElasticsearchTransportOptions = {
            level: 'info',  // Log level (info, debug, warn, error, etc.)
            client: this._loggerClient,  // Elasticsearch client instance
            index: 'logstash-nextjs',  // Elasticsearch index where logs will be stored
            transformer: (logData) => {
              return {
                message: logData.message,
                timestamp: logData.timestamp,
                level: logData.level,
                meta: logData.meta,  // Optional: Attach additional metadata
              };
            },
          };
          this._logger = winston.createLogger({
            level: 'info',
            transports: [
              new winston.transports.Console(),  // Log to console (optional)
              // new winstonElasticsearch.ElasticsearchTransport(esTransportOpts),  // Log to Elasticsearch
            ],
          });
    }
}

