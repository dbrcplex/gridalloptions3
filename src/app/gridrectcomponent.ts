import { Component } from '@angular/core';
// import { CONTEXT } from '@angular/core/src/render3/interfaces/view';

// @Component({
//   selector: "app-root",
//   templateUrl: "./app.component.html",
//   styleUrls: ["./app.component.css"]
// })

export class GridRectComponent implements CanvasRect {
  public id: number = 0;
  public startX: number = 0;
  public startY: number = 0;
  public w: number = 0;
  public h: number = 0;
  public modified: boolean = false;

  // public originalstartX: number;
  // public originalstartY: number;
  // public originalw: number;
  // public originalh: number;

  // public previousstartX: number;
  // public previousstartY: number;
  // public previousw: number;
  // public previoush: number;

  public selected: boolean = false;
  public zorder: number = 0;
  public row: number = 0;;
  public column: number = 0;

  public northwestid = 0;
  public northid = 0;
  public northeastid = 0;  
  public westid = 0;
  public eastid = 0;
  public southwestid = 0;
  public southid = 0;
  public southeastid = 0;    

  constructor (startx:number, starty:number, width:number, height:number) {
    this.startX = startx;
    this.startY = starty;
    this.w = width;
    this.h = height;
    this.zorder = 0;
    this.modified = false;
  }

  public clearRect(x:number, y:number, w:number, h:number) {}

  public fillRect() {}

  public strokeRect() {}

  // public setPrevious(): void {
  //   this.previoush = this.h;
  //   this.previousstartX = this.startX;
  //   this.previousstartY = this.startY;
  //   this.previousw = this.w;
  // }

  public showMyPosition(): void {
    console.log(
      " row = " + this.row  +
      " column = " + this.column  +
         " startX = " + this.startX  +
         " startY = " + this.startY +
         " w = " + this.w +
         " h = " + this.h);     
  }

  public showMyPositionIds(): void {
     console.log(
      " row = " + this.row  +
      " column = " + this.column  +
         " northwestid = " + this.northwestid  +
         " northid = " + this.northid +
         " northeastid = " + this.northeastid +
         " west = " + this.westid +
         " myID = " + this.id +
         " eastid = " + this.eastid +
         " southwestid = " + this.southwestid +
         " southid = " + this.southid +
         " southeastid = " + this.southeastid);        
  }

  public setMyPositionIds(numberofcolumns:number): void {   
             
////////////////////////////////////////////////////////////////////////////////////////////////////
//
//                          this is a pattern for determining the location 
//                          of all adjacent rects to "id" in the center
//
//                northwest                      north                   northeast
//        |----------------------------|----------------------|----------------------------|
//        | id - (numberofcolumns + 1) | id - numberofcolumns | id - (numberofcolumns - 1) |		
//        |----------------------------|----------------------|----------------------------|
// west   |         id - 1	           |          id 		      |        id + 1              | east
//        |----------------------------|----------------------|----------------------------|
//        | id + (numberofcolumns - 1) | id + numberofcolumns | id + (numberofcolumns + 1) | 	   
//        |----------------------------|----------------------|----------------------------|   
//                southwest                      south                   southeast
//
////////////////////////////////////////////////////////////////////////////////////////////////////

      this.northwestid = this.id - (numberofcolumns + 1);
      this.northid = this.id - numberofcolumns;
      this.northeastid = this.id - (numberofcolumns - 1);  
      this.westid = this.id - 1;
      this.eastid = this.id + 1;
      this.southwestid = this.id + (numberofcolumns - 1);
      this.southid = this.id + numberofcolumns;
      this.southeastid = this.id + (numberofcolumns + 1);    
  }
}
