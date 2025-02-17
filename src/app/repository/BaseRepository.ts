// import winston from 'winston';
// import { ElasticsearchTransportOptions } from 'winston-elasticsearch';
import { connectToDatabase } from '@/models/dbConnect';
import { Client } from '@elastic/elasticsearch';
// import winstonElasticsearch from 'winston-elasticsearch';

interface Logger{
  info:(message:unknown)=>void
  error:(message:unknown)=>void
}

export default class BaseRepository {
  _loggerClient: Client;
  _logger: Logger;
  PAGE_LIMIT = 10;

  constructor() {
    connectToDatabase(process.env.MONGODB_URI!)

    this._loggerClient = new Client({
      node: process.env.ELASTIC_URL,
      auth: {
        apiKey: process.env.ELASTIC_API!,
      },
    });

    // this._loggerClient.ping()
    //   .then(() => console.log('✅ Elasticsearch connection succeeded'))
    //   .catch((error) => {
    //     console.error('❌ Elasticsearch connection failed:', error);
    // });
    this._logger={
      info:(message:unknown)=>{
        console.log({level:"info",message,"@timestamp":new Date().toDateString()})
        this._loggerClient.index({
          index: 'logstash-nextjs',
          body: {
            message: message,
            "@timestamp": new Date().toISOString(),
            level: 'info',
          },
        })
      }
      ,
      error:(message:unknown)=>{
        console.log({level:"error",message,"@timestamp":new Date().toDateString()})
        this._loggerClient.index({
          index: 'logstash-nextjs',
          body: {
            message: message,
            "@timestamp": new Date().toISOString(),
            level: 'error',
          },
        })        
      }
    }
  }
}
