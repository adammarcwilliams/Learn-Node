exports.homePage = (req, res) => {
  res.render('index', { title: 'Food food food' });
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add store' });
};
