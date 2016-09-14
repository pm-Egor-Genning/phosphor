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
 *
 */
export
type CellFunc<T> = (row: number, column: number, value: any) => T;


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
  changed: ISignal<this, void>;

  /**
   * Draw the background for the cell.
   *
   * @param gc - The graphics context to use for drawing.
   *
   * @param config - The configuration data for the cell.
   *   This object should be treated as read-only.
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
   *   This object should be treated as read-only.
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
   *   This object should be treated as read-only.
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
    x: number;

    /**
     * The Y coordinate of the cell bounding rectangle.
     *
     * #### Notes
     * This is the viewport coordinate of the rect, and is aligned to
     * the cell boundary. It may be negative if the cell is partially
     * off-screen.
     */
    y: number;

    /**
     * The width of the cell bounding rectangle.
     *
     * #### Notes
     * This value is aligned to the cell boundary. It may extend past
     * the canvas bounds if the cell is partially off-screen.
     */
    width: number;

    /**
     * The width of the cell bounding rectangle.
     *
     * #### Notes
     * This value is aligned to the cell boundary. It may extend past
     * the canvas bounds if the cell is partially off-screen.
     */
    height: number;

    /**
     * The row index of the cell.
     */
    row: number;

    /**
     * The column index of the cell.
     */
    column: number;

    /**
     * The data value for the cell, or `null`.
     *
     * #### Notes
     * This value is provided by the data model.
     */
    value: any;

    /**
     * The renderer options for the cell, or `null`.
     *
     * #### Notes
     * This value is provided by the data model.
     */
    options: any;
  }
}


/**
 * A partial implementation of a simple cell renderer.
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
    this._backgroundColor = options.backgroundColor || '';
  }

  /**
   * Get the background color for the cell renderer.
   */
  get backgroundColor(): SimpleCellRenderer.Color {
    return this._backgroundColor;
  }

  /**
   * Set the background color for the cell renderer.
   */
  set backgroundColor(value: SimpleCellRenderer.Color) {
    // Null and undefined are treated the same.
    value = value || '';

    // Do nothing if the background color does not change.
    if (this._backgroundColor === value) {
      return;
    }

    // Update the internal background color.
    this._backgroundColor = value;

    // Emit the changed notification signal.
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

    // Lookup the effective background color.
    let bgColor = (opts && opts.backgroundColor) || this._backgroundColor;

    // Bail early if no background color is specified.
    if (!bgColor) {
      return;
    }

    // Resolve the background color to an actual color string.
    let color: string;
    if (typeof bgColor === 'string') {
      color = bgColor;
    } else {
      color = bgColor(config.row, config.column, config.value);
    }

    // Bail early if the color string is empty.
    if (!color) {
      return;
    }

    // Setup the context fill style.
    gc.fillStyle = color;

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

  private _border: SimpleCellRenderer.Border;
  private _backgroundColor: string | CellFunc<string>;
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
  interface IBorderPart {
    /**
     *
     */
    position: 'all' | 'top' | 'left' | 'right' | 'bottom';

    /**
     *
     */
    color: string;

    /**
     *
     */
    style: 'solid' | 'dash' | 'dot' | 'bold-solid' | 'bold-dash';
  }

  /**
   *
   */
  export
  type Border = IBorderPart | IBorderPart[];

  /**
   *
   */
  export
  interface IOptions {
    /**
     *
     */
    backgroundColor?: string | CellFunc<string>;

    /**
     *
     */
    border?: Border | CellFunc<Border>;
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
