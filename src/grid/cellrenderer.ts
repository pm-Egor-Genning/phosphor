/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/


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
 * This base class handles drawing the background and border of simple
 * cell, and leaves the content to be handled by a subclass.
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
    this.backgroundColor = options.backgroundColor || '';
  }

  /**
   *
   */
  backgroundColor: SimpleCellRenderer.BackgroundColor;

  /**
   * Draw the background for the cell.
   *
   * @param gc - The graphics context to use for drawing.
   *
   * @param config - The configuration data for the cell.
   *   This object should be treated as read-only.
   */
  drawBackground(gc: CanvasRenderingContext2D, config: CellRenderer.IConfig): void {
    //
    let opts = config.options as SimpleCellRenderer.IOptions;

    //
    let bgColor = (opts && opts.backgroundColor) || this.backgroundColor;

    //
    if (!bgColor) {
      return;
    }

    //
    let color = '';
    if (typeof bgColor === 'string') {
      color = bgColor;
    } else {
      color = bgColor(config.row, config.column, config.value);
    }

    //
    if (!color) {
      return;
    }

    //
    gc.fillStyle = color;
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
  type ColorFunc = (row: number, column: number, value: any) => string;

  /**
   *
   */
  export
  type BackgroundColor = string | ColorFunc;

  /**
   *
   */
  export
  interface IOptions {
    /**
     *
     */
    backgroundColor?: BackgroundColor;
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
