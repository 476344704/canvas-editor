import CardBlock from 'canvas-editor/components/canvas-block-card/component';
import Ember from 'ember';
import RunKit from 'runkit';
import layout from './template';
import styles from './styles';

const { run } = Ember;

/**
 * A component representing a RunKit.
 *
 * @class CanvasEditor.CanvasBlockRunkitComponent
 * @extends CanvasEditor.CanvasBlockCardComponent
 */
export default CardBlock.extend({
  classNames: ['canvas-block-runkit'],
  layout,
  localClassNames: ['canvas-block-runkit'],
  styles,

  didInsertElement() {
    const env = [];
    const canvasAPIURL = this.get('canvasAPIURL');
    if (canvasAPIURL) env.push(`CANVAS_URL=${canvasAPIURL}`);

    this.set('notebook', RunKit.createNotebook({
      element: this.$('.runkit').get(0),
      env,
      source: this.get('block.content'),
      onEvaluate: this.onNotebookEvaluate.bind(this)
    }));
  },

  onNotebookEvaluate() {
    this.get('notebook').getSource(source => {
      run.join(_ => {
        this.set('block.lastContent', this.get('block.content'));
        this.set('block.content', source);
        this.blockContentUpdatedLocally();
      });
    });
  }
});
