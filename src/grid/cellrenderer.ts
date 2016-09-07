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
   * Saving and restoring the graphics context state is an expensive
   * operation, which should be avoided when possible.
   *
   * The renderer **must** reset any applied clipping regions and
   * transforms before returning.
   *
   * The render **must not** draw outside of the bounding rectangle.
   */
  abstract paint(gc: CanvasRenderingContext2D, config: CellRenderer.IConfig): void;
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
class SimpleCellRenderer extends CellRenderer {
  /**
   *
   */
  paint(gc: CanvasRenderingContext2D, config: CellRenderer.IConfig): void {
    // Draw the cell background.
    this.drawBackground(gc, config);

    // Draw the cell content.
    this.drawContent(gc, config);

    // Finally, draw the cell border.
    this.drawBorder(gc, config);
  }

  /**
   *
   */
  protected drawBackground(gc: CanvasRenderingContext2D, config: CellRenderer.IConfig): void {

  }

  /**
   *
   */
  protected drawContent(gc: CanvasRenderingContext2D, config: CellRenderer.IConfig): void {
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

  /**
   *
   */
  protected drawBorder(gc: CanvasRenderingContext2D, config: CellRenderer.IConfig): void {

  }
}
