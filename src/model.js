var _ = require('underscore'), mongoose = require('mongoose'), sanitizerPlugin = require('mongoose-sanitizer'), deepPopulate = require('mongoose-deep-populate')(mongoose);
/**
 * Model general class
 */
var Model = (function () {
    function Model() {
        /**
         * List of fields to be skipped from sanitizing
         *
         * @type {Object}
         */
        this.skipSanitize = {};
    }
    /**
     * Register mongoose schema
     *
     *
     * @returns Model
     */
    Model.prototype.registerSchema = function () {
        var schema = new mongoose.Schema(this.schema);
        sanitizerPlugin(schema, { skip: this.skipSanitize });
        schema.plugin(deepPopulate, {});
        schema.set('toJSON', {
            transform: function (doc, ret, options) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                delete ret.password;
                delete ret.token;
            }
        });
        this.model = mongoose.model(this.name, schema);
        return this;
    };
    /**
     * Count model in DB
     *
     * @param cookies
     * @param headers
     * @param data
     * @param success
     * @param error
     *
     * @returns Model
     */
    Model.prototype.count = function (cookies, headers, data, success, error) {
        var criteria = {}, limit = 50, page = 0, sort = '_id';
        _.each(data, function (value, key) {
            switch (key) {
                case 'limit':
                    limit = value;
                    break;
                case 'page':
                    page = value;
                    break;
                case 'sort':
                    sort = value;
                    break;
                case 'like':
                    _.each(value, function (v, k) {
                        criteria[k] = { $regex: v };
                    });
                    break;
                case 'likeI':
                    _.each(value, function (v, k) {
                        criteria[k] = { $regex: new RegExp(v, 'i') };
                    });
                    break;
                case 'likeOr':
                    var or = [];
                    _.each(value, function (v, k) {
                        var elm = {};
                        elm[k] = { $regex: v, $options: '-i' };
                        or.push(elm);
                    });
                    criteria['$or'] = or;
                    break;
                case 'or':
                    if (!criteria['$or']) {
                        criteria['$or'] = [];
                    }
                    _.each(value, function (v, k) {
                        criteria['$or'].push(v);
                    });
                    break;
                case 'in':
                    _.each(value, function (v, k) {
                        criteria[k] = { $in: v };
                    });
                    break;
                case 'gt':
                    _.each(value, function (v, k) {
                        criteria[k] = { $gt: v };
                    });
                    break;
                case 'lt':
                    _.each(value, function (v, k) {
                        criteria[k] = { $lt: v };
                    });
                    break;
                case 'gte':
                    _.each(value, function (v, k) {
                        criteria[k] = { $gte: v };
                    });
                    break;
                case 'lte':
                    _.each(value, function (v, k) {
                        criteria[k] = { $lte: v };
                    });
                    break;
                default:
                    criteria[key] = value;
                    break;
            }
        });
        this.model
            .find(criteria)
            .count()
            .exec(function (err, result) {
            if (err) {
                return error(err, result);
            }
            success(result);
        });
        return this;
    };
    /**
     * Load one model from DB
     *
     * @param id
     * @param cookies
     * @param headers
     * @param data
     * @param success
     * @param error
     *
     * @returns Model
     */
    Model.prototype.load = function (id, cookies, headers, data, success, error) {
        var populate = [];
        _.each(data, function (value, key) {
            switch (key) {
                case 'populate':
                    populate = value;
                    break;
            }
        });
        this.model
            .findById(id)
            .deepPopulate(populate.join(' '))
            .exec(function (err, result) {
            if (err) {
                return error(err, result);
            }
            success(result);
        });
        return this;
    };
    /**
     * Get list of modeld from DB
     *
     * @param cookies
     * @param headers
     * @param data
     * @param success
     * @param error
     *
     * @returns Model
     */
    Model.prototype.list = function (data, cookies, headers, success, error) {
        var criteria = {}, fields = '', limit = 50, page = 0, sort = '_id', populate = [];
        _.each(data, function (value, key) {
            switch (key) {
                case 'limit':
                    limit = value;
                    break;
                case 'page':
                    page = value;
                    break;
                case 'sort':
                    sort = value;
                    break;
                case 'like':
                    _.each(value, function (v, k) {
                        criteria[k] = { $regex: v };
                    });
                    break;
                case 'likeI':
                    _.each(value, function (v, k) {
                        criteria[k] = { $regex: new RegExp(v, 'i') };
                    });
                    break;
                case 'likeOr':
                    var or = [];
                    _.each(value, function (v, k) {
                        var elm = {};
                        elm[k] = { $regex: v, $options: '-i' };
                        or.push(elm);
                    });
                    criteria['$or'] = or;
                    break;
                case 'or':
                    if (!criteria['$or']) {
                        criteria['$or'] = [];
                    }
                    _.each(value, function (v, k) {
                        criteria['$or'].push(v);
                    });
                    break;
                case 'in':
                    _.each(value, function (v, k) {
                        criteria[k] = { $in: v };
                    });
                    break;
                case 'gt':
                    _.each(value, function (v, k) {
                        criteria[k] = { $gt: v };
                    });
                    break;
                case 'lt':
                    _.each(value, function (v, k) {
                        criteria[k] = { $lt: v };
                    });
                    break;
                case 'gte':
                    _.each(value, function (v, k) {
                        criteria[k] = { $gte: v };
                    });
                    break;
                case 'lte':
                    _.each(value, function (v, k) {
                        criteria[k] = { $lte: v };
                    });
                    break;
                case 'populate':
                    populate = value;
                    break;
                case 'fields':
                    fields = value;
                    break;
                default:
                    criteria[key] = value;
                    break;
            }
        });
        this.model
            .find(criteria)
            .select(fields)
            .limit(limit)
            .skip(page * limit)
            .deepPopulate(populate.join(' '))
            .sort(sort)
            .exec(function (err, result) {
            if (err) {
                return error(err, result);
            }
            success(result);
        });
        return this;
    };
    /**
     * Delete model from DB
     *
     * @param cookies
     * @param headers
     * @param data
     * @param success
     * @param error
     *
     * @returns Model
     */
    Model.prototype.create = function (cookies, headers, data, success, error) {
        new this.model(data).save(function (err, result) {
            if (err) {
                return error(err, result);
            }
            success(result);
        });
        return this;
    };
    /**
     * Update one model
     *
     * @param id
     * @param cookies
     * @param headers
     * @param data
     * @param success
     * @param error
     *
     * @returns Model
     */
    Model.prototype.update = function (id, cookies, headers, data, additional, success, error) {
        var self = this;
        this.model.findOneAndUpdate({ _id: id }, data, additional, function (err, result) {
            if (err) {
                return error(err, result);
            }
            self.load(id, cookies, headers, {}, success, error);
        });
        return this;
    };
    /**
     * Delete model from DB
     *
     * @param id
     * @param cookies
     * @param headers
     * @param data
     * @param success
     * @param error
     *
     * @returns Model
     */
    Model.prototype.delete = function (id, cookies, headers, data, success, error) {
        this.model.remove({ _id: id }, function (err, result) {
            if (err) {
                return error(err, result);
            }
            success(result);
        });
        return this;
    };
    return Model;
})();
exports.Model = Model;
//# sourceMappingURL=Model.js.map