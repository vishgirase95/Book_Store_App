import multer from 'multer';


const fileStorageEngine=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'upload')
    },
    filename:(req,file,cb)=>{
cb(null,file.originalname);
    }
})

var upload = multer({ storage: fileStorageEngine });

export default upload;