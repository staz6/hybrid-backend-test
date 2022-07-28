// var request = require("request");
// var logger = require("tracer").console();
// var _ = require("lodash");
// var app_env = require("../env");
// const crypto = require("crypto");
// const { default: axios } = require("axios");
var misc_service = (function () {
  return {
   
    
    select_fields: function (object, fields) {
        var object_fields = {};
        fields.forEach(function (field) {
          if (field && object.hasOwnProperty(field) && object[field] != null) {
            object_fields[field] = object[field];
          }
        });
  
        return object_fields;
      },

    generatePassword: function (len) {
      var text = "";
      var charset = "ab!cde^fgh@ij*klm@nop^qr!stuvw&xy%z012#34564dtgADVTF~789";
      for (var i = 0; i < len; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));

      return text;
    },


   
  };
})();

module.exports = misc_service;
