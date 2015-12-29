var Boot = (function () {
    function Boot() {
    }
    /**
     * Start the application
     *
     * @returns {Boot}
     */
    Boot.prototype.start = function (app) {
        this.app = app;
        return this;
    };
    return Boot;
})();
exports.Boot = Boot;
//# sourceMappingURL=boot.js.map