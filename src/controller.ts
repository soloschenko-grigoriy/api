import {Model} from './Model';

import express = require("express");

var _ = require('underscore');

export class Controller{

  /**
   * Model ref
   */
  public model : Model;

  /**
   * Root of this routes
   */
  public root: string;

  /**
   * Available routes
   */
  public routes: string[] = ['load','list','create','update','delete'];

  /**
   * Configure routes for this controller
   *
   * @param app
   */
  public configure(app){

    this.model.registerSchema(); // prepare model

    this.root = '/api/' + this.model.name.toLowerCase() + 's'; // prepare root

    // options route
    app.options(this.root,          _.bind(this.options, this));
    app.options(this.root + '/:id', _.bind(this.options, this));

    // list route
    if(!!~_.indexOf(this.routes, 'list')){
      app.get(this.root, _.bind(this.list, this));
    }

    // load route
    if(!!~_.indexOf(this.routes, 'load')){
      app.get(this.root + '/:id', _.bind(this.load, this));
    }

    // create route
    if(!!~_.indexOf(this.routes, 'create')){
      app.post(this.root, _.bind(this.create, this));
    }

    // update route
    if(!!~_.indexOf(this.routes, 'update')){
      app.put(this.root + '/:id',   _.bind(this.update, this));
      app.patch(this.root + '/:id', _.bind(this.update, this));
    }


    // delete route
    if(!!~_.indexOf(this.routes, 'delete')){
      app.delete(this.root + '/:id', _.bind(this.delete, this));
    }

    return this;
  }

  /**
   * Allow cross domain requests
   *
   * @param req
   * @param res
   * @param next
   *
   * @returns Controller
   */
  public allowCrossDomain(req : express.Request, res : express.Response, next : Function): Controller{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,HEAD,POST,PUT,PATCH,UPDATE,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Length,Content-Type,X-Auth-Token');

    return this;
  }

  /**
   * Options request
   *
   * @param req
   * @param res
   * @param next
   *
   * @returns Controller
   */
  public options(req : express.Request, res : express.Response, next : Function) : Controller{
    this.allowCrossDomain(req, res, next);

    res.json(true);

    return this;
  }

  /**
   * Count request
   *
   * @param req
   * @param res
   * @param next
   *
   * @returns Controller
   */
  public count(req : express.Request, res : express.Response, next : Function) : Controller{
    this.allowCrossDomain(req, res, next);

    this.model.count(req.cookies, req.headers, req.query, function (result) {
      res.json(result);
    }, function(err, status){
      res.status(status || 500).send(err);
    });

    return this;
  }

  /**
   * Load model from DB
   *
   * @param req
   * @param res
   * @param next
   *
   * @returns Controller
   */
  public load(req : express.Request, res : express.Response, next : Function) : Controller{
    this.allowCrossDomain(req, res, next);

    this.model.load(req.params.id, req.cookies, req.headers, req.query, function (result) {
      res.json(result);
    }, function(err, status){
      res.status(status || 500).send(err);
    });

    return this;
  }

  /**
   * List models
   *
   * @param req
   * @param res
   * @param next
   *
   * @returns Controller
   */
  public list(req : express.Request, res : express.Response, next : Function) : Controller{
    this.allowCrossDomain(req, res, next);

    this.model.list(req.cookies, req.headers, req.query, function (result) {
      res.json(result);
    }, function(err, status){
      res.status(status || 500).send(err);
    });

    return this;
  }

  /**
   * Create new model
   *
   * @param req
   * @param res
   * @param next
   *
   * @returns Controller
   */
  public create(req : express.Request, res : express.Response, next : Function) : Controller{
    this.allowCrossDomain(req, res, next);

    this.model.create(req.cookies, req.headers, req.body, function (result) {
      res.json(result);
    }, function(err, status){
      res.status(status || 500).send(err);
    });

    return this;
  }

  /**
   * Update model in DB
   *
   * @param req
   * @param res
   * @param next
   *
   * @returns Controller
   */
  public update(req : express.Request, res : express.Response, next : Function) : Controller{
    this.allowCrossDomain(req, res, next);

    this.model.update(req.params.id, req.cookies, req.headers, req.body, {}, function (result) {
      res.json(result);
    }, function(err, status){
      res.status(status || 500).send(err);
    });

    return this;
  }

  /**
   * Delet model from Db
   *
   * @param req
   * @param res
   * @param next
   *
   * @returns Controller
   */
  public delete(req : express.Request, res : express.Response, next : Function) : Controller{
    this.allowCrossDomain(req, res, next);

    this.model.delete(req.params.id, req.cookies, req.headers, req.body, function (result) {
      res.json(true);
    }, function(err, status){
      res.status(status || 500).send(err);
    });

    return this;
  }
}