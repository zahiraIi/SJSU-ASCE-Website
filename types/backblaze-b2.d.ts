declare module 'backblaze-b2' {
  export class B2 {
    constructor(options: {
      applicationKeyId: string;
      applicationKey: string;
    });
    
    authorize(): Promise<any>;
    
    downloadUrl: string;
    
    getDownloadAuthorization(options: {
      bucketName: string;
      fileNamePrefix: string;
      validDurationInSeconds: number;
    }): Promise<{ data: { authorizationToken: string } }>;
    
    listFileNames(options: {
      bucketName: string;
      prefix?: string;
      maxFileCount?: number;
      startFileName?: string;
    }): Promise<{ data: { files: any[] } }>;
    
    getFileInfo(options: {
      fileId: string;
    }): Promise<{ data: any }>;
    
    downloadFileByName(options: {
      bucketName: string;
      fileName: string;
      responseType?: string;
    }): Promise<any>;
  }
} 