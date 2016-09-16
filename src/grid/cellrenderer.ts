/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  ISignal, defineSignal
} from '../core/signaling';


/**
 * An object which renders the contents of a grid cell.
 *
 * #### Notes
 * A single cell renderer instance can be used to render the contents
 * of multiple cells, as well as the contents of header cells. A cell
 * renderer is registered by name with a grid or header and specified
 * for use by an associated data model.
 */
export
abstract class CellRenderer {
  /**
   * A signal emitted when the state of the renderer has changed.
   *
   * #### Notes
   * Subclasses should emit this signal when their state has changed
   * such that any listening grids should re-render their content.
   */
  readonly changed: ISignal<this, void>;

  /**
   * Draw the background for the cell.
   *
   * @param gc - The graphics context to use for drawing.
   *
   * @param config - The configuration data for the cell.
   *
   * #### Notes
   * The renderer **must not** draw outside of the box specified by
   * `(x - 1, y - 1`) and `(x + width - 1, y + height - 1)`.
   */
  abstract drawBackground(gc: CanvasRenderingContext2D, config: CellRenderer.IConfig): void;

  /**
   * Draw the content for the cell.
   *
   * @param gc - The graphics context to use for drawing.
   *
   * @param config - The configuration data for the cell.
   *
   * #### Notes
   * The renderer **must not** draw outside of the box specified by
   * `(x - 1, y - 1`) and `(x + width - 1, y + height - 1)`.
   */
  abstract drawContent(gc: CanvasRenderingContext2D, config: CellRenderer.IConfig): void;

  /**
   * Draw the border for the cell.
   *
   * @param gc - The graphics context to use for drawing.
   *
   * @param config - The configuration data for the cell.
   *
   * #### Notes
   * The renderer **must not** draw outside of the box specified by
   * `(x - 1, y - 1`) and `(x + width - 1, y + height - 1)`.
   */
  abstract drawBorder(gc: CanvasRenderingContext2D, config: CellRenderer.IConfig): void;
}


// Define the signals for the `CellRenderer` class
defineSignal(CellRenderer.prototype, 'changed');


/**
 * The namespace for the `CellRenderer` class statics.
 */
export
namespace CellRenderer {
  /**
   * An object which holds the configuration data for a cell.
   */
  export
  interface IConfig {
    /**
     * The X coordinate of the cell bounding rectangle.
     *
     * #### Notes
     * This is the viewport coordinate of the rect, and is aligned to
     * the cell boundary. It may be negative if the cell is partially
     * off-screen.
     */
    readonly x: number;

    /**
     * The Y coordinate of the cell bounding rectangle.
     *
     * #### Notes
     * This is the viewport coordinate of the rect, and is aligned to
     * the cell boundary. It may be negative if the cell is partially
     * off-screen.
     */
    readonly y: number;

    /**
     * The width of the cell bounding rectangle.
     *
     * #### Notes
     * This value is aligned to the cell boundary. It may extend past
     * the canvas bounds if the cell is partially off-screen.
     */
    readonly width: number;

    /**
     * The width of the cell bounding rectangle.
     *
     * #### Notes
     * This value is aligned to the cell boundary. It may extend past
     * the canvas bounds if the cell is partially off-screen.
     */
    readonly height: number;

    /**
     * The row index of the cell.
     */
    readonly row: number;

    /**
     * The column index of the cell.
     */
    readonly column: number;

    /**
     * The data value for the cell, or `null`.
     *
     * #### Notes
     * This value is provided by the data model.
     */
    readonly value: any;

    /**
     * The renderer options for the cell, or `null`.
     *
     * #### Notes
     * This value is provided by the data model.
     */
    readonly options: any;
  }
}


/**
 * A partial implementation of a cell renderer.
 *
 * #### Notes
 * This abstract base class draws the background and border for a
 * cell, while leaving the cell content to be drawn by a subclass.
 */
export
abstract class SimpleCellRenderer extends CellRenderer {
  /**
   * Construct a new simple cell renderer.
   *
   * @param options - The options for initializing the renderer.
   */
  constructor(options: SimpleCellRenderer.IOptions = {}) {
    super();
    this._background = options.background || null;
    this._border = options.border || null;
  }

  /**
   * Get the background options for the cell renderer.
   */
  get background(): SimpleCellRenderer.BackgroundOptions | null {
    return this._background;
  }

  /**
   * Set the background options for the cell renderer.
   */
  set background(value: SimpleCellRenderer.BackgroundOptions | null) {
    if (this._background === value) {
      return;
    }
    this._background = value;
    this.changed.emit(void 0);
  }

  /**
   * Get the border options for the cell renderer.
   */
  get border(): SimpleCellRenderer.BorderOptions | null {
    return this._border;
  }

  /**
   * Set the border options for the cell renderer.
   */
  set border(value: SimpleCellRenderer.BorderOptions | null) {
    if (this._border === value) {
      return;
    }
    this._border = value;
    this.changed.emit(void 0);
  }

  /**
   * Draw the background for the cell.
   *
   * @param gc - The graphics context to use for drawing.
   *
   * @param config - The configuration data for the cell.
   *   This object should be treated as read-only.
   */
  drawBackground(gc: CanvasRenderingContext2D, config: CellRenderer.IConfig): void {
    // Cast the data model options to the appropriate type.
    let opts = config.options as SimpleCellRenderer.IOptions;

    // Lookup the background options.
    let bgOpts = (opts && opts.background) || this._background;

    // Bail early if no background options are specified.
    if (!bgOpts) {
      return;
    }

    // Resolve the options function if necessary.
    let ibgOpts = typeof bgOpts === 'function' ? bgOpts(config) : bgOpts;

    // Bail early if no color is specified.
    if (!ibgOpts.color) {
      return;
    }

    // Setup the context fill style.
    gc.fillStyle = ibgOpts.color;

    // Fill the background with the specified color.
    gc.fillRect(config.x - 1, config.y - 1, config.width + 1, config.height + 1);
  }

  /**
   * Draw the border for the cell.
   *
   * @param gc - The graphics context to use for drawing.
   *
   * @param config - The configuration data for the cell.
   *   This object should be treated as read-only.
   */
  drawBorder(gc: CanvasRenderingContext2D, config: CellRenderer.IConfig): void {

  }

  private _background: SimpleCellRenderer.BackgroundOptions | null;
  private _border: SimpleCellRenderer.BorderOptions | null;
}


/**
 * The namespace for the `SimpleCellRenderer` class statics.
 */
export
namespace SimpleCellRenderer {
  /**
   *
   */
  export
  interface IBackgroundOptions {
    /**
     *
     */
    readonly color?: string;
  }

  /**
   *
   */
  export
  type BorderWeight = 'thin' | 'medium' | 'thick';

  /**
   *
   */
  export
  type BorderLineStyle = 'none' | 'solid' | 'dash' | 'dot';

  /**
   *
   */
  export
  type BorderDrawOrder = (
    'blrt' | 'bltr' | 'brlt' | 'brtl' | 'btlr' | 'btrl' |
    'lbrt' | 'lbtr' | 'lrbt' | 'lrtb' | 'ltbr' | 'ltrb' |
    'rblt' | 'rbtl' | 'rlbt' | 'rltb' | 'rtbl' | 'rtlb' |
    'tblr' | 'tbrl' | 'tlbr' | 'tlrb' | 'trbl' | 'trlb'
  );

  /**
   *
   */
  export
  interface IBorderOptions {
    /**
     *
     */
    readonly drawOrder?: BorderDrawOrder;

    /**
     *
     */
    readonly color?: string;

    /**
     *
     */
    readonly weight?: BorderWeight;

    /**
     *
     */
    readonly lineStyle?: BorderLineStyle;

    /**
     *
     */
    readonly topColor?: string;

    /**
     *
     */
    readonly topWeight?: BorderWeight;

    /**
     *
     */
    readonly topLineStyle?: BorderLineStyle;

    /**
     *
     */
    readonly leftColor?: string;

    /**
     *
     */
    readonly leftWeight?: BorderWeight;

    /**
     *
     */
    readonly leftLineStyle?: BorderLineStyle;

    /**
     *
     */
    readonly rightColor?: string;

    /**
     *
     */
    readonly rightWeight?: BorderWeight;

    /**
     *
     */
    readonly rightLineStyle?: BorderLineStyle;

    /**
     *
     */
    readonly bottomColor?: string;

    /**
     *
     */
    readonly bottomWeight?: BorderWeight;

    /**
     *
     */
    readonly bottomLineStyle?: BorderLineStyle;
  }

  /**
   *
   */
  export
  type BackgroundOptions = IBackgroundOptions | ((config: CellRenderer.IConfig) => IBackgroundOptions);

  /**
   *
   */
  export
  type BorderOptions = IBorderOptions | ((config: CellRenderer.IConfig) => IBorderOptions);

  /**
   *
   */
  export
  interface IOptions {
    /**
     *
     */
    readonly background?: BackgroundOptions;

    /**
     *
     */
    readonly border?: BorderOptions;
  }
}


/**
 *
 */
export
class TextCellRenderer extends SimpleCellRenderer {
  /**
   *
   */
  drawContent(gc: CanvasRenderingContext2D, config: CellRenderer.IConfig): void {
    // Bail if there is no cell value.
    if (!config.value) {
      return;
    }

    //
    gc.fillStyle = 'black';
    gc.textBaseline = 'middle';

    //
    let text = config.value.toString();
    let x = config.x + 2;
    let y = config.y + config.height / 2;

    gc.fillText(text, x, y);
  }
}
