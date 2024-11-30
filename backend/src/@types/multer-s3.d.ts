declare module "multer-s3" {
  import { StorageEngine } from "multer";

  interface MulterS3Options {
    s3: any;
    bucket: string;
    acl?: string;
    contentType?: (req: any, file: any) => string;
    metadata?: (
      req: any,
      file: any,
      cb: (err: any, metadata: any) => void
    ) => void;
    key: (req: any, file: any, cb: (err: any, key: string) => void) => void;
  }

  function multerS3(options: MulterS3Options): StorageEngine;

  export = multerS3;
}
