import { Component } from '@angular/core';
import { calculatePath } from '../module/path';
import { drawPath, splitCoor } from '../module/helper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'graph-traversal';
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  //grid size
  multiArray:Array<any> = []; //multidimensional array
  xGrid:number = 20; // row length
  yGrid:number = 20; //column length
  width:number = 30; //cell width
  height:number = 30; //cell height

  grids: any;
  graphGrid: any;

  xStart:number = 0; //source x point
  yStart:number = 0; //source y point
  xTarget:number = 0; //destination x point
  yTarget:number = 0; //destination y point

  startPos:string; //cell formatted source coordinate e.g: (1,2)
  targetPos:string; //cell formatted destination coordinate 

  pathGraph:Array<any> = [];
  widthIndicator:Array<any> = [];
  heightIndicator:Array<any> = [];

  constructor() {}

  ngOnInit() {
    this.xStart = 1;
    this.yStart = 1;
    this.xTarget = this.xGrid;
    this.yTarget = this.yGrid;
    this.drawingMap();
    this.initGrid();
  }

  //creating multidimensional array default 20x20
  drawingMap = ():void => {
    this.multiArray = [];
    this.widthIndicator = [];
    this.heightIndicator = [];

    for (let c = 0; c < this.yGrid; c++) {
      this.multiArray[c] = [];
      for (let r = 0; r < this.xGrid; r++) {
        let number = (Math.random() > 0.2) ? 0 : 1;
        this.multiArray[c][r] = number;
      }
    }

    for (let w = 0; w < this.yGrid; w++) this.heightIndicator.push(w + 1);
    for (let h = 0; h < this.xGrid; h++) this.widthIndicator.push(h + 1);
  }

  initGrid = ():void => {
    this.grids = this.buildCells(this.multiArray);
    this.graphGrid = this.onRenderGrid();
    this.drawGrid(this.graphGrid, this.grids);
    this.startPos = `${this.xStart - 1},${this.yStart - 1}`;
    this.targetPos = `${this.xTarget - 1},${this.yTarget - 1}`;
    drawPath(this.graphGrid, splitCoor(this.startPos), this.grids.cellWidth, this.grids.cellHeight, 'green');
    drawPath(this.graphGrid, splitCoor(this.targetPos), this.grids.cellWidth, this.grids.cellHeight, 'red');
  }

  //click generate button
  generateGrid = ():void => {
    if (this.xGrid > 0 && this.yGrid > 0) {
      this.xStart = 1;
      this.yStart = 1;
      this.xTarget = this.xGrid;
      this.yTarget = this.yGrid;
      this.drawingMap();
      this.initGrid();
    } else {
      if (this.xGrid < 1) this.xGrid = 20;
      if (this.yGrid < 1) this.yGrid = 20;
      alert('Minimum No. of X and Y is 1')
    }
  }

  removeWall = (): void => {
    this.multiArray = [];
    this.widthIndicator = [];
    this.heightIndicator = [];

    if (this.xGrid > 0 && this.yGrid > 0) {
      this.xTarget = this.xGrid;
      this.yTarget = this.yGrid;
    } else {
      if (this.xGrid < 1) this.xGrid = 20;
      if (this.yGrid < 1) this.yGrid = 20;
      alert('Minimum No. of X and Y is 1')
    }

    for (let c = 0; c < this.yGrid; c++) {
      this.multiArray[c] = [];
      for (let r = 0; r < this.xGrid; r++) this.multiArray[c][r] = 0;
    }

    for (let w = 0; w < this.yGrid; w++) this.heightIndicator.push(w + 1);
    for (let h = 0; h < this.xGrid; h++)  this.widthIndicator.push(h + 1);

    this.initGrid();
  }

  buildCells = (maze:any):any => {
    let data = {
      data: maze,
      width: maze[0].length,
      height: maze.length,
      cellWidth: this.width,
      cellHeight: this.height
    }
    return data;
  }

  onRenderGrid = ():any => {
    let maze = this.grids
    this.canvas = <HTMLCanvasElement>document.getElementById('dynamicMap');
    this.canvas.width = maze.cellWidth * maze.width;
    this.canvas.height = maze.cellHeight * maze.height;
    return {
      canvasEl: this.canvas,
      ctx: this.canvas.getContext('2d'),
      primaryColor: 'white',
      secondaryColor: '#383838'
    };
  }

  drawGrid = (renderGraph:any, maze:any):void =>  {
    let ctx = renderGraph.ctx;
    let canvas = renderGraph.canvasEl;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < maze.height; y++) {
      for (let x = 0; x < maze.width; x++) {
        let cellType = maze.data[y][x];
        if (cellType === 1) {
          ctx.fillStyle = renderGraph.secondaryColor;
        } else {
          ctx.fillStyle = renderGraph.primaryColor;
        }
        ctx.fillRect(x * maze.cellWidth, y * maze.cellHeight,
          maze.cellWidth, maze.cellHeight);
        ctx.strokeStyle = "black";
        ctx.strokeRect(x * maze.cellWidth, y * maze.cellHeight,
          maze.cellWidth, maze.cellHeight);
      }
    }
  }

  onClickCell = ($event:any):void => {
    let x = Math.floor($event.offsetY / this.width); //to get exact x-coordinate of each cell
    let y = Math.floor($event.offsetX / this.height); //to get exact y-coordinate of each cell
    this.multiArray[x][y] = this.multiArray[x][y] === 0 ? 1 : 0;
    this.initGrid();
  }

  setStart = (): void => {
    if (this.xStart > 0 && this.yStart > 0) {
      if (this.xStart > this.xGrid || this.yStart > this.yGrid) {
        if (this.xStart > this.xGrid) {
          this.xStart = 1;
          alert('Number entered is more than number of Row existed')
        }
        if (this.yStart > this.yGrid) {
          this.yStart = 1;
          alert('Number entered is more than number of Column existed')
        }
      } else {
        this.drawingMap();
        this.initGrid();
      }
    } else {
      if (this.xStart < 1) this.xStart = 1;
      if (this.yStart < 1) this.yStart = 1;
    }
    this.initGrid();
  }

  setTarget = ():void => {
    if (this.xTarget > 0 && this.yTarget > 0) {
      if (this.xTarget > this.xGrid || this.yTarget > this.yGrid) {
        if (this.xTarget > this.xGrid) {
          this.xTarget = this.xGrid;
          alert('Number entered is more than number of Column existed')
        }
        if (this.yTarget > this.yGrid) {
          this.yTarget = this.yGrid;
          alert('Number entered is more than number of Row existed')
        }
      } else {
        this.drawingMap();
        this.initGrid();
      }
    } else {
      if (this.xTarget < 1) this.xTarget = this.xGrid;
      if (this.yTarget < 1) this.yTarget = this.yGrid;
      alert('Minimum number entered is 1')
    }
  }

  doBFS = ():void => {
    this.initGrid();
    if(this.multiArray[this.xStart - 1][this.yStart- 1] === 1) this.multiArray[this.xStart - 1][this.yStart - 1] = 0;
    if(this.multiArray[this.xTarget - 1][this.yTarget - 1] === 1) this.multiArray[this.xTarget - 1][this.yTarget - 1] = 0;
    this.pathGraph = calculatePath(this.grids, this.startPos, this.targetPos, 'breadth');
    this.runPath(this.pathGraph[0], this.pathGraph[1], this.graphGrid, this.grids, this.targetPos);
  }

  doDFS = ():void => {
    this.initGrid();
    if(this.multiArray[this.xStart - 1][this.yStart- 1] === 1) this.multiArray[this.xStart - 1][this.yStart - 1] = 0;
    if(this.multiArray[this.xTarget - 1][this.yTarget - 1] === 1) this.multiArray[this.xTarget - 1][this.yTarget - 1] = 0;
    this.pathGraph = calculatePath(this.grids, this.startPos, this.targetPos, 'depth');
    this.runPath(this.pathGraph[0], this.pathGraph[1], this.graphGrid, this.grids, this.targetPos);
  }

  runPath = (path:Array<any>, optimal:Array<any>, renderer:any, map:any, targetPos:any):any => {
    let pos = 0;
    let opac = 0.4;
    function render() {
      if (pos < path.length) {
        drawPath(renderer, splitCoor(path[pos]), map.cellWidth, map.cellHeight, '#eaea57');
      } else {
        drawPath(renderer, splitCoor(targetPos), map.cellWidth, map.cellHeight, 'purple');
        if(optimal !== null){
          opac = 1;
          optimal.forEach((posi) => {
            drawPath(renderer, splitCoor(posi), map.cellWidth, map.cellHeight, 'purple');
            renderer.ctx.globalAlpha = opac;
          });
          setTimeout(() => {
            alert('Success to the Target')
          },200)
        }
        else{
          alert('No Path to the Target')
        }
        return;
      }
      pos += 1;
      setTimeout(render, 30);
    }
    renderer.ctx.globalAlpha = opac;
    return render();
  };

}
