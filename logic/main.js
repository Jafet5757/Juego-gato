const logic = {};

logic.home = (req, res)=>{
    res.render('index',{});
};

module.exports = logic;