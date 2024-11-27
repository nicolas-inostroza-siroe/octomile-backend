




export const filesFilter = (req: Express.Request, files: Express.Multer.File[], callback: Function) => {

    console.log(files);
    return callback(null, true);

    // if (!file) return callback(new Error("File is empty"), false);


    // const fileExtension = file.mimetype.split("/")[1];
    // const fileExtension = file.originalname.split(".")[1];
    // console.log(fileExtension);
    // const validExtensions = ["xlsx", "xls", "csv", "word"];

    // if (validExtensions.includes(fileExtension)) {
    //     return callback(null, true);
    // }

    // callback(null, false);

}