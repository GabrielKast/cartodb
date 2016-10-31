var Backbone = require('backbone');
var EditFeatureGeometryFormModel = require('../../../../../../javascripts/cartodb3/editor/layers/edit-feature-content-views/edit-feature-geometry-form-model');
var EditFeatureGeometryPointFormModel = require('../../../../../../javascripts/cartodb3/editor/layers/edit-feature-content-views/edit-feature-geometry-point-form-model');

describe('editor/layers/edit-feature-content-views/edit-feature-geometry-form-model', function () {
  beforeEach(function () {
    this.featureModel = new Backbone.Model({
      the_geom: '{"type":"Point","coordinates":[0,0]}',
      name: '',
      description: ''
    });
  });

  describe('when type is point', function () {
    beforeEach(function () {
      this.formModel = new EditFeatureGeometryPointFormModel({
        lat: 0,
        lng: 0
      }, {
        featureModel: this.featureModel
      });
    });

    it('should generate lat lng schema from geometry', function () {
      expect(this.formModel.schema).toEqual({
        lat: {
          type: 'Number',
          showSlider: false,
          validators: ['required'],
          editorAttrs: { disabled: true }
        },
        lng: {
          type: 'Number',
          showSlider: false,
          validators: ['required'],
          editorAttrs: { disabled: true }
        }
      });
    });

    describe('when form data changes', function () {
      it('should update feature model', function () {
        expect(this.featureModel.get('the_geom')).toBe('{"type":"Point","coordinates":[0,0]}');
        this.formModel.set('lat', 1);
        expect(this.featureModel.get('the_geom')).toBe('{"type":"Point","coordinates":[0,1]}');
      });
    });
  });

  describe('when type is not point', function () {
    var formModel;
    var featureModel;

    beforeEach(function () {
      featureModel = new Backbone.Model({
        the_geom: '{"type":"LineString","coordinates":[[0,0],[0,1]]}',
        name: '',
        description: ''
      });

      formModel = new EditFeatureGeometryFormModel(featureModel.toJSON(), {
        featureModel: featureModel
      });
    });

    it('should generate schema from geometry', function () {
      expect(formModel.schema).toEqual({
        the_geom: {
          type: 'Text',
          validators: [ 'required' ],
          editorAttrs: { disabled: true }
        }
      });
    });

    describe('when form data changes', function () {
      it('should update feature model', function () {
        expect(featureModel.get('the_geom')).toBe('{"type":"LineString","coordinates":[[0,0],[0,1]]}');
        formModel.set('the_geom', '{"type":"LineString","coordinates":[[0,0],[1,1]]}');
        expect(featureModel.get('the_geom')).toBe('{"type":"LineString","coordinates":[[0,0],[1,1]]}');
      });
    });
  });
});