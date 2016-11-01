var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
  //this turns logging of each query off; set to true if you want logging
    logging: false
});
const marked=require('marked');

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
        type: Sequelize.ENUM('open', 'closed')
    },
    tags:{
      type: Sequelize.ARRAY(Sequelize.TEXT),
      set: function(value) {
        if (typeof(value) === 'string') {
          const tagArray = value.split(/\s+/g).map((tag) => tag.trim());
          this.setDataValue('tags', tagArray);
        } else {
          this.setDataValue('tags', value);
        }
      }
    }
},{
  getterMethods:{
    route: function(){
      return '/wiki/'+this.urlTitle;
    },
    renderedContent:function(){
        return marked(this.content)
      }
  },
  classMethods:{
    findByTag: function(tag){
      return Page.findAll({
        where: {
          tags :{
            $overlap:[tag]
          }
        }
      })
    }
  },
  instanceMethods:{
    findSimilar: function(){
      return Page.findAll({
        where:{
          tags:{
            $overlap:this.tags
          },
          id:{
            $ne:this.id
          }
        }
      })
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
