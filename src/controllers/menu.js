const MenuModel = require("../models/menu");

class MenuController {
    static getAllMenu(req, res) {
        const { page, limit, status } = req.query;

        let pageNo = page ? Number.parseInt(page) : 1;
        let pageLimit = limit ? Number.parseInt(limit) : 10;
        let skip = pageNo === 1 ? 0 : pageLimit * (pageNo - 1);

        MenuModel.find({}, (err, resp) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    message: "Sorry an error occured",
                });
            } else {
                if (!resp.length) {
                    return res.status(404).json({
                        message: "No results found",
                    });
                } else {
                    return res.status(200).json({
                        message: "Success",
                        datalength: resp.length,
                        next: pageNo + 1,
                        prev: pageNo === 1 ? null : pageNo - 1,
                        data: resp,
                    });
                }
            }
        })
            .limit(pageLimit)
            .skip(skip);
    }
}

module.exports = MenuController;
