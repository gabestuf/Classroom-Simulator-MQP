const fs = require("fs");

module.exports = (obj) => {
    fs.writeFile("./obj.json", JSON.stringify(obj), "utf8", function (err) {
        if (err) {
            return console.error(err);
        }

        console.log("The file was saved!");
    });
};