import multer from 'multer'

const storage = multer.memoryStorage();

const multerFilter = (req,file,cb) => {
    if(file.mimetype.startsWith('image/')){
        cb(null,true)
    }
    else cb(new Error('only images are accepted'),false)
}

const upload = multer({
    storage:storage,
    fileFilter:multerFilter
})

export default upload;