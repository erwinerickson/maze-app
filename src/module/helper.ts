export const drawPath = (renderer:any, point:Array<any>, width:number, height:number, cellFill:string):void => {
  renderer.ctx.fillStyle = cellFill;
  renderer.ctx.fillRect(point[0] * width, point[1] * height, width, height);
  renderer.ctx.strokeStyle = "black"; //outerline of visited cell
  renderer.ctx.strokeRect(point[0] * width, point[1] * height, width, height);
};

export const splitCoor = (coordinate:any):any => (
  coordinate.split(',').map((v) => {
    return v | 0;
  })
)