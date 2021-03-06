/*globals describe it beforeEach afterEach jQuery sinon assert */
describe('jQuery.proxyAll(obj, args...)', function () {
  beforeEach(function () {
    this.proxy = sinon.stub(jQuery, 'proxy').returns(function proxied() {});
    this.target = {
      prop1: '',
      method1: function method1() {},
      method2: function method2() {},
      method3: function method3() {}
    };

    this.cloned = jQuery.extend({}, this.target);
  });

  afterEach(function () {
    this.proxy.restore();
  });

  it('should bind the methods provided to the object', function () {
    jQuery.proxyAll(this.target, 'method1', 'method2');

    assert.called(this.proxy);

    assert.calledWith(this.proxy, this.cloned.method1, this.target);
    assert.calledWith(this.proxy, this.cloned.method2, this.target);
    assert.neverCalledWith(this.proxy, this.cloned.method3, this.target);
  });

  it('should allow regular expressions to be provided', function () {
    jQuery.proxyAll(this.target, /method[1-2]/);

    assert.called(this.proxy);

    assert.calledWith(this.proxy, this.cloned.method1, this.target);
    assert.calledWith(this.proxy, this.cloned.method2, this.target);
    assert.neverCalledWith(this.proxy, this.cloned.method3, this.target);
  });

  it('should skip properties that are not functions', function () {
    jQuery.proxyAll(this.target, 'prop1');
    assert.notCalled(this.proxy);
  });

  it('should not bind function more than once', function () {
    jQuery.proxyAll(this.target, 'method1');
    jQuery.proxyAll(this.target, 'method1');

    assert.calledOnce(this.proxy);
  });

  it('should not bind function more than once if the method name is passed twice', function () {
    jQuery.proxyAll(this.target, 'method1', 'method1');

    assert.calledOnce(this.proxy);
  });

  it('should return the first argument', function () {
    assert.equal(jQuery.proxyAll(this.target), this.target);
  });
});
