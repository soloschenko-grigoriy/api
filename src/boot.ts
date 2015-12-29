import express = require("express");


export class Boot{

  /**
   * Ref to express app
   */
  public app : express.Application;

  /**
   * Start the application
   *
   * @returns {Boot}
   */
  public start (app : express.Application): Boot{
    this.app = app;


		return this;
  }
}