/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/


/**
 * An object which holds the configuration data for a cell.
 */
export
interface ICellConfig {
  /**
   * The X coordinate of the bounding rectangle.
   *
   * #### Notes
   * This is the visible canvas coordinate of the rect, and is aligned
   * to the cell boundary. It may be negative if the cell is partially
   * visible.
   */
  x: number;

  /**
   * The Y coordinate of the bounding rectangle.
   *
   * #### Notes
   * This is the visible canvas coordinate of the rect, and is aligned
   * to the cell boundary. It may be negative if the cell is partially
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


/**
 * An object which renders the contents of a grid cell.
 *
 * #### Notes
 * A single cell renderer instance can be used to render the contents
 * of multiple cells, as well as the contents of header cells. A cell
 * renderer is registered by name with a given grid and/or header and
 * is specified for use by the associated data model.
 */
export
interface ICellRenderer {
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
   * operation, which should be avoided when possible. However, the
   * renderer **must** reset clipping regions and transforms before
   * returning.
   *
   * The render **must not** draw outside of the bounding rectangle.
   */
  paint(gc: CanvasRenderingContext2D, config: ICellConfig): void;
}


/**
 *
 */
export
class SimpleCellRenderer implements ICellRenderer {
  /**
   *
   */
  paint(gc: CanvasRenderingContext2D, config: ICellConfig): void {
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
  protected drawBackground(gc: CanvasRenderingContext2D, config: ICellConfig): void {

  }

  /**
   *
   */
  protected drawContent(gc: CanvasRenderingContext2D, config: ICellConfig): void {
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
  protected drawBorder(gc: CanvasRenderingContext2D, config: ICellConfig): void {

  }
}
