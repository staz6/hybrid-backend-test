//Helpers functions
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
  };
})();

module.exports = misc_service;
