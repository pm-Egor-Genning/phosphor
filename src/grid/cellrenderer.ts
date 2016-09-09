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
   * Paint the contents for the specified cell.
   *
   * @param gc - The graphics context to use for rendering.
   *
   * @param config - The configuration data for the cell.
   *
   * #### Notes
   * The renderer should treat the configuration data as read-only.
   *
   * The render **must not** draw outside of the bounding rectangle.
   * Saving and restoring the graphics context state is an expensive
   * operation, which should be avoided if possible. A clipping rect
   * **is not** setup for the cell in advance. The renderer **must**
   * reset applied clipping regions and transforms before returning.
   */
  // abstract paint(gc: CanvasRenderingContext2D, config: CellRenderer.IConfig): void;

  abstract drawBackground(gc: CanvasRenderingContext2D, config: CellRenderer.IConfig): void;

  abstract drawContent(gc: CanvasRenderingContext2D, config: CellRenderer.IConfig): void;

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
     * The X coordinate of the bounding rectangle.
     *
     * #### Notes
     * This is the viewport coordinate of the rect, and is aligned to
     * the cell boundary. It may be negative if the cell is partially
     * visible.
     */
    x: number;

    /**
     * The Y coordinate of the bounding rectangle.
     *
     * #### Notes
     * This is the viewport coordinate of the rect, and is aligned to
     * the cell boundary. It may be negative if the cell is partially
     * visible.
     */
    y: number;

    /**
     * The width of the bounding rectangle.
     *
     * #### Notes
     * This value is aligned to the cell boundary.
     */
    width: number;

    /**
     * The width of the bounding rectangle.
     *
     * #### Notes
     * This value is aligned to the cell boundary.
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
     * The data value for the cell.
     *
     * #### Notes
     * This value is provided by the data model.
     */
    value: any;

    /**
     * The renderer options for the cell.
     *
     * #### Notes
     * This value is provided by the data model.
     */
    options: any;
  }
}


/**
 *
 */
export
abstract class SimpleCellRenderer extends CellRenderer {
  /**
   *
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
   *
   */
  drawBackground(gc: CanvasRenderingContext2D, config: CellRenderer.IConfig): void {
    //
    let opts = config.options as SimpleCellRenderer.IOptions;

    //
    let bgColor = (opts && opts.backgroundColor) || this.backgroundColor;

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
   *
   */
  drawBorder(gc: CanvasRenderingContext2D, config: CellRenderer.IConfig): void {
    if ((config.row === 10) && (config.column === 10)) {
      gc.beginPath();
      gc.rect(config.x - 0.0, config.y - 0.0, config.width - 1, config.height -1);
      gc.strokeStyle = 'red';
      gc.lineWidth = 2;
      gc.stroke();
    }
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
