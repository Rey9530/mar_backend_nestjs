export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file.originalname.match(/\.(mp4)$/)) {
    return callback(new Error('Solo se permiten archivos mp4.'), false);
  }
  callback(null, true);
};
