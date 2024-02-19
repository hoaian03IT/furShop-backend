const fs = require('fs')

const getImage = (req, res, next) =>{
    const imageName = req.query.image;
    const path = `src\\public\\images\\${imageName}`
    fs.readFile(path, (err, data) =>{
        if(err) return res.status(404).json({
            title:'not found',
            message: 'dont find image have this path name: ' + path
        })
        return res.end(data)
    })
}

module.exports = getImage