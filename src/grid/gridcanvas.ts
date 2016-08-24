/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  Message, sendMessage
} from '../core/messaging';

import {
  ISignal
} from '../core/signaling';

import {
  ResizeMessage, Widget, WidgetFlag, WidgetMessage
} from '../ui/widget';

import {
  ICellConfig, ICellRenderer
} from './cellrenderer';

import {
  DataModel
} from './datamodel';


/**
 * The class name added to grid canvas instance.
 */
const GRID_CANVAS_CLASS = 'p-GridCanvas';

/**
 * The class name added to the canvas node of a grid canvas.
 */
const CANVAS_CLASS = 'p-GridCanvas-canvas';


/**
 * A widget which renders the cells of a grid.
 *
 * #### Notes
 * User code will not normally interact with this class directly.
 *
 * The `DataGrid` class uses an instance of the class internally.
 */
export
class GridCanvas extends Widget {
  /**
   * Construct a new grid canvas.
   *
   * @param options - The options for initializing the canvas.
   */
  constructor(options: GridCanvas.IOptions = {}) {
    super();
    this.addClass(GRID_CANVAS_CLASS);
    this.setFlag(WidgetFlag.DisallowLayout);

    // Create the off-screen rendering buffer.
    this._buffer = document.createElement('canvas');
    this._buffer.width = 0;
    this._buffer.height = 0;

    // Create the on-screen rendering canvas.
    this._canvas = document.createElement('canvas');
    this._canvas.className = CANVAS_CLASS;
    this._canvas.width = 0;
    this._canvas.height = 0;
    this._canvas.style.position = 'absolute';
    this._canvas.style.top = '0px';
    this._canvas.style.left = '0px';
    this._canvas.style.width = '0px';
    this._canvas.style.height = '0px';

    // Attach the canvas to the widget node.
    this.node.appendChild(this._canvas);
  }

  /**
   * Get the data model rendered by the canvas.
   */
  get model(): DataModel {
    return this._model;
  }

  /**
   * Set the data model rendered by the canvas.
   */
  set model(value: DataModel) {
    // Null and undefined are treated the same.
    value = value || null;

    // Do nothing if the model does not change.
    if (this._model === value) {
      return;
    }

    // Disconnect the signal handlers from the old model.
    if (this._model) {
      // TODO
    }

    // Connect the signal handlers for the new model.
    if (value) {
      // TODO
    }

    // Update the internal model reference.
    this._model = value;

    // Schedule an update of the canvas.
    this.update();
  }

  /**
   * Get the row sections for the canvas.
   */
  get rowSections(): GridCanvas.ISections {
    return this._rowSections;
  }

  /**
   * Set the row sections for the canvas.
   */
  set rowSections(value: GridCanvas.ISections) {
    // Null and undefined are treated the same.
    value = value || null;

    // Lookup the old sections.
    let old = this._rowSections;

    // Do nothing if the sections do not change.
    if (old === value) {
      return;
    }

    // Disconnect the signal handlers from the old sections.
    if (old) {
      old.sectionsResized.disconnect(this._onSectionsResized, this);
    }

    // Connect the signal handlers for the new sections.
    if (value) {
      value.sectionsResized.connect(this._onSectionsResized, this);
    }

    // Update the internal sections reference.
    this._rowSections = value;

    // Schedule an update of the canvas.
    this.update();
  }

  /**
   * Get the column sections for the canvas.
   */
  get columnSections(): GridCanvas.ISections {
    return this._columnSections;
  }

  /**
   * Set the column sections for the canvas.
   */
  set columnSections(value: GridCanvas.ISections) {
    // Null and undefined are treated the same.
    value = value || null;

    // Lookup the old sections.
    let old = this._columnSections;

    // Do nothing if the sections do not change.
    if (old === value) {
      return;
    }

    // Disconnect the signal handlers from the old sections.
    if (old) {
      old.sectionsResized.disconnect(this._onSectionsResized, this);
    }

    // Connect the signal handlers for the new sections.
    if (value) {
      value.sectionsResized.connect(this._onSectionsResized, this);
    }

    // Update the internal sections reference.
    this._columnSections = value;

    // Schedule an update of the canvas.
    this.update();
  }

  /**
   * Get the scroll X offset of the canvas.
   */
  get scrollX(): number {
    return this._scrollX;
  }

  /**
   * Set the scroll X offset of the canvas.
   */
  set scrollX(value: number) {
    this.scrollTo(value, this._scrollY);
  }

  /**
   * Get the scroll Y offset of the canvas.
   */
  get scrollY(): number {
    return this._scrollY;
  }

  /**
   * Set the scroll Y offset of the canvas.
   */
  set scrollY(value: number) {
    this.scrollTo(this._scrollX, value);
  }

  /**
   * Scroll the canvas by the specified delta.
   *
   * @param dx - The scroll X delta, in pixels.
   *
   * @param dy - The scroll Y delta, in pixels.
   */
  scrollBy(dx: number, dy: number): void {
    this.scrollTo(this._scrollX + dx, this._scrollY + dy);
  }

  /**
   * Scroll to the specified offset position.
   *
   * @param x - The scroll X offset, in pixels.
   *
   * @param y - The scroll Y offset, in pixels.
   *
   * #### Notes
   * Negative values will be clamped to zero.
   *
   * Fractional values will be rounded to the nearest integer.
   *
   * The canvas can be scrolled beyond the bounds of the rendered grid
   * if desired. Practically, there is no limit to the scroll position.
   * Technically, the limit is `Number.MAX_SAFE_INTEGER`.
   */
  scrollTo(x: number, y: number): void {

  }

  /**
   *
   */
  listCellRenderers(): string[] {
    return Object.keys(this._cellRenderers);
  }

  /**
   *
   */
  getCellRenderer(name: string): ICellRenderer {
    return this._cellRenderers[name] || null;
  }

  /**
   *
   */
  setCellRenderer(name: string, renderer: ICellRenderer): void {
    this._cellRenderers[name] = renderer || null;
    this.update();
  }

  /**
   * A message handler invoked on an `'after-show'` message.
   */
  protected onAfterShow(msg: Message): void {
    this.fit();
  }

  /**
   * A message handler invoked on an `'after-attach'` message.
   */
  protected onAfterAttach(msg: Message): void {
    this.fit();
  }

  /**
   * A message handler invoked on an `'update-request'` message.
   */
  protected onUpdateRequest(msg: Message): void {
    // Do nothing if the widget is not visible.
    if (!this.isVisible) {
      return;
    }

    // Get the visible size of the canvas.
    let width = this._canvas.width;
    let height = this._canvas.height;

    // Do nothing if the canvas has zero area.
    if (width === 0 || height === 0) {
      return;
    }

    // Paint the entire canvas.
    this._paint(0, 0, width, height);
  }

  /**
   * A message handler invoked on a `'fit-request'` message.
   */
  protected onFitRequest(msg: Message): void {
    // Do nothing if the widget is not visible.
    if (!this.isVisible) {
      return;
    }

    // Measure the node size.
    let width = Math.round(this.node.offsetWidth);
    let height = Math.round(this.node.offsetHeight);

    // Resize the canvas to fit.
    this._canvas.width = width;
    this._canvas.height = height;
    this._canvas.style.width = `${width}px`;
    this._canvas.style.height = `${height}px`;

    // Repaint immediately.
    sendMessage(this, WidgetMessage.UpdateRequest);
  }

  /**
   * A message handler invoked on a `'resize'` message.
   */
  protected onResize(msg: ResizeMessage): void {
    // Bail early if the widget is not visible.
    if (!this.isVisible) {
      return;
    }

    // Unpack the message data.
    let { width, height } = msg;

    // Measure the node if the dimensions are unknown.
    if (width === -1) {
      width = this.node.offsetWidth;
    }
    if (height === -1) {
      height = this.node.offsetHeight;
    }

    // Round the dimensions to the nearest pixel.
    width = Math.round(width);
    height = Math.round(height);

    // Get the current size of the canvas.
    let oldWidth = this._canvas.width;
    let oldHeight = this._canvas.height;

    // Determine whether there is valid content to blit.
    let needBlit = oldWidth > 0 && oldHeight > 0 && width > 0 && height > 0;

    // Resize the off-screen buffer to the new size.
    this._buffer.width = width;
    this._buffer.height = height;

    // Blit the old contents into the buffer, if needed.
    if (needBlit) {
      let bufferGC = this._buffer.getContext('2d');
      bufferGC.drawImage(this._canvas, 0, 0);
    }

    // Resize the on-screen canvas to the new size.
    this._canvas.width = width;
    this._canvas.height = height;
    this._canvas.style.width = `${width}px`;
    this._canvas.style.height = `${height}px`;

    // Blit the buffer contents into the canvas, if needed.
    if (needBlit) {
      let canvasGC = this._canvas.getContext('2d');
      canvasGC.drawImage(this._buffer, 0, 0);
    }

    // Compute the sizes of the dirty regions.
    let right = Math.max(0, width - oldWidth);
    let bottom = Math.max(0, height - oldHeight);

    // Paint the dirty region at the right, if needed.
    if (right > 0) {
      this._paint(oldWidth, 0, right, height);
    }

    // Paint the dirty region at the bottom, if needed.
    if (bottom > 0) {
      this._paint(0, oldHeight, width - right, bottom);
    }
  }

  /**
   * Paint the portion of the canvas contained within a rect.
   *
   * This is the primary painting entry point. This method invokes
   * all of the other grid drawing methods in the correct order.
   */
  private _paint(rx: number, ry: number, rw: number, rh: number): void {
    // Get the rendering context for the canvas.
    let gc = this._canvas.getContext('2d');

    // Fill the dirty rect with the void space color.
    gc.fillStyle = '#D4D4D4';  // TODO make configurable.
    gc.fillRect(rx, ry, rw, rh);

    // Bail if there is no data model, row, or column sections.
    if (!this._model || !this._rowSections || !this._columnSections) {
      return;
    }

    // Compute the upper-left cell index.
    let i1 = this._columnSections.sectionAt(rx + this._scrollX);
    let j1 = this._rowSections.sectionAt(ry + this._scrollY);

    // Bail if no cell intersects the origin. Since the canvas scroll
    // position cannot be negative, no cells intersect the rect. This
    // also handles the case where the data model is empty.
    if (i1 < 0 || j1 < 0) {
      return;
    }

    // Compute the lower-right cell index.
    let i2 = this._columnSections.sectionAt(rx + rw + this._scrollX - 1);
    let j2 = this._rowSections.sectionAt(ry + rh + this._scrollY - 1);

    // Clamp the cells to the model limits, if needed.
    if (i2 < 0) {
      i2 = this._model.columnCount() - 1;
    }
    if (j2 < 0) {
      j2 = this._model.rowCount() - 1;
    }

    // Compute the origin of the cell bounding box.
    let x = this._columnSections.sectionPosition(i1) - this._scrollX;
    let y = this._rowSections.sectionPosition(j1) - this._scrollY;

    // Setup the drawing region.
    let rgn: Private.IRegion = {
      x: x, y: y, width: 0, height: 0,
      firstRow: j1, firstColumn: i1,
      rowSizes: [], columnSizes: []
    };

    // Update the column sizes and total region width.
    for (let i = 0, n = i2 - i1 + 1; i < n; ++i) {
      let s = this._columnSections.sectionSize(i1 + i);
      rgn.columnSizes[i] = s;
      rgn.width += s;
    }

    // Update the row sizes and total region height.
    for (let j = 0, n = j2 - j1 + 1; j < n; ++j) {
      let s = this._rowSections.sectionSize(j1 + j);
      rgn.rowSizes[j] = s;
      rgn.height += s;
    }

    // Draw the background behind the cells.
    this._drawBackground(gc, rgn);

    // Draw the grid lines for the cells.
    this._drawGridLines(gc, rgn);

    // Finally, draw the actual cell contents.
    let t1 = performance.now();
    this._drawCells(gc, rgn);
    let t2 = performance.now();
    console.log('t', t2 - t1);

    // temporary: draw the painted rect.
    gc.beginPath();
    gc.rect(rgn.x + 0.5, rgn.y + 0.5, rgn.width - 1, rgn.height - 1);
    gc.lineWidth = 1;
    gc.strokeStyle = Private.nextColor();
    gc.stroke();
  }

  /**
   * Draw the background for the given grid region.
   */
  private _drawBackground(gc: CanvasRenderingContext2D, rgn: Private.IRegion): void {
    // Setup the rendering context.
    gc.fillStyle = 'white';  // TODO make configurable

    // Fill the dirty rect with the background color.
    gc.fillRect(rgn.x, rgn.y, rgn.width, rgn.height);
  }

  /**
   * Draw the grid lines for the given grid region.
   */
  private _drawGridLines(gc: CanvasRenderingContext2D, rgn: Private.IRegion): void {
    // Setup the rendering context.
    gc.lineWidth = 1;
    gc.lineCap = 'butt';
    gc.strokeStyle = 'gray';  // TODO make configurable

    // Start the path for the grid lines.
    gc.beginPath();

    // Draw the vertical grid lines.
    let y1 = rgn.y;
    let y2 = rgn.y + rgn.height;
    let colSizes = rgn.columnSizes;
    for (let i = 0, x = rgn.x - 0.5, n = colSizes.length; i < n; ++i) {
      x += colSizes[i];
      gc.moveTo(x, y1);
      gc.lineTo(x, y2);
    }

    // Draw the horizontal grid lines.
    let x1 = rgn.x;
    let x2 = rgn.x + rgn.width;
    let rowSizes = rgn.rowSizes;
    for (let j = 0, y = rgn.y - 0.5, n = rowSizes.length; j < n; ++j) {
      y += rowSizes[j];
      gc.moveTo(x1, y);
      gc.lineTo(x2, y);
    }

    // Stroke the path to render the lines.
    gc.stroke();
  }

  /**
   * Draw the cells for the given grid region.
   */
  private _drawCells(gc: CanvasRenderingContext2D, rgn: Private.IRegion): void {
    // Unpack common region variables.
    let startX = rgn.x;
    let startY = rgn.y;
    let firstRow = rgn.firstRow;
    let firstCol = rgn.firstColumn;
    let rowSizes = rgn.rowSizes;
    let colSizes = rgn.columnSizes;
    let rowCount = rowSizes.length;
    let colCount = colSizes.length;

    // Setup the common variables.
    let rendererName = '';
    let model = this._model;
    let renderer: ICellRenderer = null;
    let cellRenderers = this._cellRenderers;

    // Setup the data model cell data object.
    let data: DataModel.ICellData = {
      value: null,
      renderer: '',
      options: null
    };

    // Setup the cell config object.
    let config: ICellConfig = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      row: -1,
      column: -1,
      value: null,
      options: null
    };

    // Iterate over the columns in the region.
    for (let i = 0, x = startX; i < colCount; ++i) {

      // Lookup the column width.
      let width = colSizes[i];

      // Ignore the column if its width is zero.
      if (width === 0) {
        continue;
      }

      // Compute the column index.
      let column = i + firstCol;

      // Iterate over the rows in the column.
      for (let j = 0, y = startY; j < rowCount; ++j) {

        // Lookup the row height.
        let height = rowSizes[j];

        // Ignore the row if its height is zero.
        if (height === 0) {
          continue;
        }

        // Compute the row index.
        let row = j + firstRow;

        // Reset the cell data parameters.
        data.value = null;
        data.renderer = 'default';
        data.options = null;

        // Load the cell data from the data model.
        model.cellData(row, column, data);

        // Fetch the new cell renderer if needed.
        if (data.renderer !== rendererName) {
          rendererName = data.renderer;
          renderer = cellRenderers[rendererName];
        }

        // Bail if there is no renderer for the cell.
        // TODO draw an error cell?
        if (!renderer) {
          continue;
        }

        // Set the cell config parameters.
        config.x = x;
        config.y = y;
        config.width = width;
        config.height = height;
        config.row = row;
        config.column = column;
        config.value = data.value;
        config.options = data.options;

        // Paint the cell using the selected renderer.
        renderer.paint(gc, config);

        // Finally, increment the running Y coordinate.
        y += height;
      }

      // Finally, increment the running X coordinate.
      x += width;
    }
  }

  /**
   * Handle the `sectionsResized` signal of the grid sections.
   */
  private _onSectionsResized(sender: GridCanvas.ISections, range: GridCanvas.ISectionRange): void {

  }

  private _scrollX = 0;
  private _scrollY = 0;
  private _model: DataModel = null;
  private _buffer: HTMLCanvasElement;
  private _canvas: HTMLCanvasElement;
  private _rowSections: GridCanvas.ISections = null;
  private _columnSections: GridCanvas.ISections = null;
  private _cellRenderers = Private.createRendererMap();
}


/**
 * The namespace for the `GridCanvas` class statics.
 */
export
namespace GridCanvas {
  /**
   * An options object for initializing a grid canvas.
   */
  export
  interface IOptions {

  }

  /**
   * An object which represents a range of sections.
   */
  export
  interface ISectionRange {
    /**
     * The first index in the range, inclusive.
     *
     * This must be an integer `<= last`.
     */
    first: number;

    /**
     * The last index in the range, inclusive.
     *
     * This must be an integer `>= first`.
     */
    last: number;
  }

  /**
   * An object which controls the geometry of sections in a grid.
   *
   * #### Notes
   * A grid canvas uses two of these objects to layout the cells
   * in the grid: one for rows, and one for columns. The methods
   * of these objects are called often, and should be as efficient
   * as possible.
   */
  export
  interface ISections {
    /**
     * A signal emitted when sections have been resized.
     *
     * The args object is the range of sections affected.
     */
    sectionsResized: ISignal<ISections, ISectionRange>;

    /**
     * Get the origin of a specific section.
     *
     * @params index - The index of the section of interest.
     *
     * @returns The integer position of the section in pixels,
     *   or `-1` if the index is out of range.
     *
     * #### Notes
     * The sections **must** be arranged in a dense sequence such that
     * `sectionPosition(i) + sectionSize(i) === sectionPosition(i + 1)`.
     *
     * The position for index `0` **must** be `0`.
     */
    sectionPosition(index: number): number;

    /**
     * Get the size of a specific section.
     *
     * @params index - The index of the section of interest.
     *
     * @returns The integer size of the section in pixels, or
     *   `-1` if the index is out of range.
     *
     * #### Notes
     * The size of a valid index **must** be `>= 0`.
     *
     * If a section has a `0` size, it will not be rendered.
     */
    sectionSize(index: number): number;

    /**
     * Get the index of the section at a given position.
     *
     * @params position - The position of the section of interest.
     *
     * @returns The index of the section which intersects the
     *   given position, or `-1` if the position is out of range.
     *
     * #### Notes
     * The position will be an integer `>= 0`.
     */
    sectionAt(position: number): number;
  }
}


/**
 * The namespace for the module private data.
 */
namespace Private {
  /**
   * An object which represents the dirty region of a grid.
   *
   * A dirty region is always aligned to whole-cell boundaries.
   */
  export
  interface IRegion {
    /**
     * The X coordinate of the dirty rect.
     *
     * This value corresponds to the canvas coordinates of the left
     * edge of the first cell in the region. It is already adjusted
     * for the grid scroll offset.
     */
    x: number;

    /**
     * The Y coordinate of the dirty rect.
     *
     * This value corresponds to the canvas coordinates of the top
     * edge of the first cell in the region. It is already adjusted
     * for the grid scroll offset.
     */
    y: number;

    /**
     * The width of the dirty rect.
     *
     * This is the total width of all columns in the region.
     */
    width: number;

    /**
     * The height of the dirty rect.
     *
     * This is the total height of all rows in the region.
     */
    height: number;

    /**
     * The index of the first row in the region.
     */
    firstRow: number;

    /**
     * The index of the first column in the region.
     */
    firstColumn: number;

    /**
     * The sizes of the rows in the region.
     */
    rowSizes: number[];

    /**
     * The sizes of the columns in the region.
     */
    columnSizes: number[];
  }

  /**
   * A type alias for a cell renderer map.
   */
  export
  type RendererMap = { [name: string]: ICellRenderer };

  /**
   * Create a new renderer map for a grid canvas.
   */
  export
  function createRendererMap(): RendererMap {
    return Object.create(null);
  }

  const colors = [
    'red', 'green', 'blue', 'yellow', 'orange', 'cyan'
  ];

  let ci = 0;

  export
  function nextColor(): string {
    return colors[ci++ % colors.length];
  }
}
