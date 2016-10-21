var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
  //this turns logging of each query off; set to true if you want logging
    logging: false
});

var Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed'),
    }
    // ,date: {
    //   type: Sequelize.DATE,
    //   defaultValue: Sequelize.NOW
    // }
},{
  getterMethods:{
    route: function(){
      return '/wiki/'+this.urlTitle;
    }
  }
});


var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        isEmail: true
    }
});

Page.belongsTo(User, { as: 'author' });


function generateUrlTitle (title) {
  if (title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    // Generates random 5 letter string
    return Math.random().toString(36).substring(2, 7);
  }
}

Page.hook('beforeValidate', function(page) {
  page.urlTitle=generateUrlTitle(page.title)
})

module.exports = {
  Page: Page,
  User: User
};
