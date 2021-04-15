import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild, RendererFactory2 } from '@angular/core';

import { fromEvent, Subscription } from 'rxjs';
import { pairwise, switchMap, takeUntil, refCount } from 'rxjs/operators';
import { GridRectComponent } from './gridrectcomponent';
import { GridEllipseComponent } from './gridellipsecomponent';
import { Colors } from './colors';
// import { stringify } from '@angular/core/src/util';
import { AbstractControl, FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';

// let drag = false;
let mouseX = 0;
let mouseY = 0;
const closeEnough = 6;
let dragTL = false;
let dragBL = false;
let dragTR = false;
let dragBR = false;
let rects: GridRectComponent[] = [];
let ellipses: GridEllipseComponent[] = [];
let ctx: CanvasRenderingContext2D;
let ctx2: CanvasRenderingContext2D;
let canvasEl: any;
let canvasE2: HTMLCanvasElement;
let columnslider: any;
let rowslider: any;
let rectwidthslider: any;
let rectheightslider: any;
let speedslider: any;
let cellspeed = 1;
let pinkinterval: any;
let redinterval: any;
let orangeinterval: any;
let yellowinterval: any;
let browninterval: any;
let purpleinterval: any;
let whiteinterval: any;
let greyblackinterval: any;
let greeninterval: any;
let cyaninterval: any;
let blueinterval: any;
let totalarea = 0;
let selectedrectarea = 0;
let selectedrectid = 0;
let numberofcolumns = 10;
let numberofrows = 10;
let rectw = 8;
let recth = 5;    
const WHITE = '#FFFFFF';
const BLACK = '#000000';
const BLUE = '#ADD8E6';
const BLUEVIOLET = '#151293';
const GREEN = '#79FF33';
let formGroup: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
//    template: `
//    <form [formGroup]="form" (ngSubmit)="submit()">
//    <label formArrayName="orders" *ngFor="let order of formData.controls; let i = index">
//      <input type="checkbox" [formControlName]="i">
//      {{orders[i].name}}
//    </label>
 
//    <div *ngIf="!form.valid">At least one order must be selected</div>
//    <br>  
//    <button id="btnsubmit" [disabled]="!form.valid">submit</button> 
//    <!--<button [disabled]="!form.valid">reset</button> -->
//    &nbsp;
//    <button id="btndownload" [disabled]="!form.valid">snapshot</button>
//  </form>  
//      <canvas #canvas></canvas>
//    `,
  // template: `<canvas #canvas></canvas><canvas #canvas2></canvas>`, // two canvases
  // styles: [
  //   `
  //     canvas {
  //       border: px solid #000;
  //       display:block;
  //       width:100%; 
  //       height:100%;
  //     }
  //   `,
  //   `
  //   body { margin:0; width:100%; height:100%; overflow:hidden; padding:0; } 
  //   `
  // ]
})

export class AppComponent implements AfterViewInit, OnDestroy {

  public title = 'gridtestapp';

 form!: FormGroup;
 // this is to fix the error during production build
 //   "Property 'controls' does not exist on type 'AbstractControl'"
 //
 get formData() { return <FormArray>this.form.get('colors'); }

  colors = [
    { id: 0, name: 'Pink', },
    { id: 1, name: 'Red' },
    { id: 2, name: 'Orange' },
    { id: 3, name: 'Yellow' },
    { id: 4, name: 'Brown' },
    { id: 5, name: 'Purple' },
    { id: 6, name: 'White' },
    { id: 7, name: 'GreyBlack' },
    { id: 8, name: 'Green' },
    { id: 9, name: 'Cyan' },
    { id: 10, name: 'Blue' }
  ];

  @ViewChild('canvas') public canvas!: ElementRef;  
 
  // Event handler for download
 // dwn.onclick = function(){
  //  download(canvas, 'myimage.png');
//  }

  //public canvas: ElementRef = this.getElementById('canvas');
  // @ViewChild('canvas2') canvas2: ElementRef; // second canvas
  public drawingSubscription!: Subscription;

  public multiplier: number = 0;
  spacebetweenrects = 2;

  constructor(private formBuilder: FormBuilder) {
    const controls = this.colors.map(c => new FormControl(false));
    this.form = this.formBuilder.group({
     colors: new FormArray(controls, this.minSelectedCheckboxes(1))
    });
  }


  public ngAfterViewInit() {
    // get the context    
    canvasEl = document.getElementById('canvas');
    ctx = canvasEl.getContext('2d');
    ctx.lineWidth = 1;
    ctx.lineCap = 'square';
    ctx.strokeStyle = BLACK;

    columnslider = document.getElementById("columnrange");    
    var nc = document.getElementById("numberofcolumns");
    nc!.innerHTML = columnslider.value;
    numberofcolumns = columnslider.value;
    // columnslider.addEventListener('oninput', ()=>{
    //   this.drawRects();
    //   });
    columnslider.oninput = function() {
      nc!.innerHTML = this.value;     
      numberofcolumns = this.value; 
    }

    rowslider = document.getElementById("rowrange");
    var nr = document.getElementById("numberofrows");
    nr!.innerHTML = rowslider.value;
    numberofrows = rowslider.value;    
    rowslider.oninput = function() {
      nr!.innerHTML = this.value;  
      numberofrows = this.value;    
    }

    rectwidthslider = document.getElementById("rectwidth");
    var rw = document.getElementById("cellwidth");
    rw!.innerHTML = rectwidthslider.value;
    rectw = rectwidthslider.value;
    rectwidthslider.oninput = function() {
      rw!.innerHTML = this.value;  
      rectw = this.value;    
    }

    rectheightslider = document.getElementById("rectheight");
    var rh = document.getElementById("cellheight");
    rh!.innerHTML = rectheightslider.value;    
    recth = rectheightslider.value;
    rectheightslider.oninput = function() {
      rh!.innerHTML = this.value;   
      recth = this.value;   
    }

    speedslider = document.getElementById("timerspeed");
    var ss = document.getElementById("speed");
    ss!.innerHTML = speedslider.value;    
    cellspeed = speedslider.value;
    speedslider.oninput = function() {
      ss!.innerHTML = this.value;   
      cellspeed = this.value;   
    }
    
    let sbmit = document.getElementById('btnsubmit');
     sbmit!.addEventListener('click', ()=>{
      this.submit();
      });

     let pause = document.getElementById('btnpause');
     pause!.addEventListener('click', ()=>{
      this.pause();
      });    

     let resume = document.getElementById('btnresume');
     resume!.addEventListener('click', ()=>{
      this.resume();
      });    

     let rset = document.getElementById('btnreset');
     rset!.addEventListener('click', ()=>{
        this.reset();
     });

     this.pause();

     // this.drawRects();
      
      // turn these off for when we are just painting
    // canvasEl.addEventListener('mousedown', this.mouseDown, false);
    // canvasEl.addEventListener('mouseup', this.mouseUp, false);
    // canvasEl.addEventListener('mousemove', this.mouseMove, false);
    // window.addEventListener("resize", function(drawRects) {      
    // });

   //  canvasEl.addEventListener('resize', thi  s.drawRects, false);
    // second canvas
    // canvasE2 = this.canvas2.nativeElement;
    // canvasE2.style.width = '100%';
    // canvasE2.style.height = '100%';
    // canvasE2.height = canvasE2.offsetHeight;
    // canvasE2.width = canvasE2.offsetWidth;
    // ctx2 = canvasE2.getContext('2d');   
    
    // Colors.PinkColors.DeepPink;
  }


  private reset() {
    window.clearInterval(pinkinterval);
    window.clearInterval(redinterval);
    window.clearInterval(orangeinterval);
    window.clearInterval(yellowinterval);
    window.clearInterval(browninterval);
    window.clearInterval(purpleinterval);
    window.clearInterval(whiteinterval);
    window.clearInterval(greyblackinterval);
    window.clearInterval(greeninterval);
    window.clearInterval(cyaninterval);
    window.clearInterval(blueinterval);
    
    // reset
    this.drawRects();
    // this.drawEllipses();
  }

  private pause() {
    window.clearInterval(pinkinterval);
    window.clearInterval(redinterval);
    window.clearInterval(orangeinterval);
    window.clearInterval(yellowinterval);
    window.clearInterval(browninterval);
    window.clearInterval(purpleinterval);
    window.clearInterval(whiteinterval);
    window.clearInterval(greyblackinterval);
    window.clearInterval(greeninterval);
    window.clearInterval(cyaninterval);
    window.clearInterval(blueinterval);
  }

  private resume() {
    this.startIntervals();
  }

private  submit() {    
    // reset
     this.drawRects();
     // this.drawEllipses();
    this.startIntervals();

    // window.setInterval(() => { this.download(); }, 60000);
  }

  private startIntervals() {
    const selectedOrderIds = this.form.value.colors
      .map((v: any, i: number) => v ? this.colors[i].name : null)
      .filter((v: null) => v !== null);
    for (const color of selectedOrderIds) {
      console.log('color selected = ' + color);
      const excolors: string[] = ['#000000']; //exclude black     
      switch (color) {
        case 'Pink':
          pinkinterval = window.setInterval(() => { this.useColorPaletteRect(Colors.PinkColors, excolors); }, cellspeed);
          break;
        case 'Red':
          redinterval = window.setInterval(() => { this.useColorPaletteRect(Colors.RedColors, excolors); }, cellspeed);
          break;
        case 'Orange':
          orangeinterval = window.setInterval(() => { this.useColorPaletteRect(Colors.OrangeColors, excolors); }, cellspeed);
          break;
        case 'Yellow':
          yellowinterval = window.setInterval(() => { this.useColorPaletteRect(Colors.YellowColors, excolors); }, cellspeed);
          break;
        case 'Brown':
          browninterval = window.setInterval(() => { this.useColorPaletteRect(Colors.BrownColors, excolors); }, cellspeed);
          break;
        case 'Purple':
          purpleinterval = window.setInterval(() => { this.useColorPaletteRect(Colors.PurpleColors, excolors); }, cellspeed);
          break;
        case 'White':
          whiteinterval = window.setInterval(() => { this.useColorPaletteRect(Colors.WhiteColors, excolors); }, cellspeed);
          break;
        case 'GreyBlack':
          greyblackinterval = window.setInterval(() => { this.useColorPaletteRect(Colors.GreyBlackColors, excolors); }, cellspeed);
          break;
        case 'Green':
          greeninterval = window.setInterval(() => { this.useColorPaletteRect(Colors.GreenColors, excolors); }, cellspeed);
          break;
        case 'Cyan':
          cyaninterval = window.setInterval(() => { this.useColorPaletteRect(Colors.CyanColors, excolors); }, cellspeed);
          break;
        case 'Blue':
          blueinterval = window.setInterval(() => { this.useColorPaletteRect(Colors.BlueColors, excolors); }, cellspeed);
          break;
      }
    }
  }

//  public minSelectedCheckboxes(min = 1) {
//   const validator: ValidatorFn = (formArray: FormArray) => {
//     const totalSelected = formArray.controls
//       .map(control => control.value)
//       .reduce((prev, next) => next ? prev + next : prev, 0);

//     return totalSelected >= min ? null : { required: true };
//   };

// https://stackoverflow.com/questions/63268569/angular-formarray-validatorfn-doesnt-compile-typescript
minSelectedCheckboxes(min = 1) {
  const validator: ValidatorFn = (formArray: AbstractControl) => {
    if (formArray instanceof FormArray) {
      const totalSelected = formArray.controls
        .map((control) => control.value)
        .reduce((prev, next) => (next ? prev + next : prev), 0);
      return totalSelected >= min ? null : { required: true };
    }

    throw new Error('formArray is not an instance of FormArray');
  };

  return validator;
} 

 /* Canvas Donwload */
 private download() {
  /// create an "off-screen" anchor tag
  var lnk = document.createElement('a'), e;
  
  // const selectedOrderIds = this.form.value.orders
  //     .map((v, i) => v ? this.orders[i].name : null)
  //     .filter(v => v !== null);
  
  //     for (const color of selectedOrderIds) {
  //       filename += color;
  //     }
  /// the key here is to set the download attribute of the a tag
  console.log(new Date().getTime());
  lnk.download =  new Date().getTime().toString();// filename;

  /// convert canvas content to data-uri for link. When download
  /// attribute is set the content pointed to by link will be
  /// pushed as "download" in HTML5 capable browsers
  lnk.href = canvasEl.toDataURL("image/png;base64");
  lnk.click();

  /// create a "fake" click-event to trigger the download
//   if (document.createEvent) {
//     e = document.createEvent("MouseEvents");
//     e.initMouseEvent("click", true, true, window,
//                      0, 0, 0, 0, 0, false, false, false,
//                      false, 0, null);

//     lnk.dispatchEvent(e);
//   } // else if (lnk.fireEvent) {
//     // lnk.fireEvent("onclick");
//   // }
 }

  public drawRects() {    

    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;
    let rowid = 1;
    let columnid = 1;    
    rects = [];
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    let totalrects = numberofcolumns * numberofrows;
    console.log('totalrects = ' + totalrects);
    for (var i = 1; i < totalrects; i++) {
      // the first one
      if (rects.length === 0) {         
        const rect: GridRectComponent = new GridRectComponent(canvasEl.clientLeft + this.spacebetweenrects, canvasEl.clientTop + this.spacebetweenrects, rectw, recth);
        rect.id = 1;
        rects[rects.length] = rect;
        rect.setMyPositionIds(numberofcolumns);
        rect.row = 1;
        rect.column = 1;
        // rect.showMyPosition();
      }
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
      if (rects.length > 0) {       
        const rect: GridRectComponent = new GridRectComponent(canvasEl.clientLeft + this.spacebetweenrects, canvasEl.clientTop + this.spacebetweenrects, rectw, recth);
        rect.id = rects.length + 1;
       
        rect.setMyPositionIds(numberofcolumns);
        
       if (rects.length % numberofcolumns === 0) {                
         rect.startX = Number(rects[0].startX)
         rect.startY = Number(rects[rect.westid - 1].startY) + Number(rects[rect.westid - 1].h); 
         rowid += 1;     
         rect.row = rowid;            
         columnid = 0;         
         // console.log('started new row ' + rowid);
        
       }
       else {
        rect.row = rowid;
        rect.startX = Number(rects[rect.westid - 1].startX) + Number(rects[rect.westid - 1].w);
         if(rowid === 1) {
          Number(rects[rect.westid - 1].startY) + Number(rects[rect.westid - 1].h);
         }
          if(rowid > 1) {
           rect.startY = Number(rects[rect.northid - 1].startY) + Number(rects[rect.northid - 1].h);
        }
       }            
       columnid += 1;
       rect.column = columnid; 
       // rect.showMyPosition();
       rects[rects.length] = rect;
      }
    }
    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;
    for (const rect of rects) {
      ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
      totalarea += rect.w * rect.h;
    }

    // let dwn = document.getElementById('btndownload');
    // dwn.addEventListener('click', this.download, false);
    // console.log(dwn);

    // let dwnsubmit = document.getElementById('btnsubmit');
    // dwnsubmit.removeEventListener('click', this.download, false);
    // console.log(dwnsubmit);

     // use this syntax to pass an argument to the method
     // the last parameter is an interval in milliseconds
     // window.setInterval(() => { this.showRandomRects(BLACK); }, 1);
     // window.setInterval(this.showRandomRectsAuto, 1);
     //let colors:Colors = new Colors();
    // colors.addPinkColors();
     // const excolors:string[] = ['#000000']; //exclude black     
     // dbrcplex.github.io/gridtestdeploy1
     // window.setInterval(() => { this.useColorPalette(Colors.BlueColors, excolors); }, 1);
     // window.setInterval(() => { this.useColorPalette(Colors.GreenColors, excolors); }, 3);

     // dbrcplex.github.io/gridtestorangered
     // window.setInterval(() => { this.useColorPalette(Colors.OrangeColors, excolors); }, 1);
     // window.setInterval(() => { this.useColorPalette(Colors.RedColors, excolors); }, 3);
     // this.saveCanvasAsPNG();
    // let colormap:Map<string, string>;
  }

  
  private drawEllipses() {    

    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;
    let rowid = 1;
    let columnid = 1;    
    ellipses = [];
    //  console.log('numberofcolumns = ' + numberofcolumns);
    //  console.log('numberofrows = ' + numberofrows);
    //  console.log('rectw = ' + rectw);
    //  console.log('recth = ' + recth);    
    // ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    let totalellipses = numberofcolumns * numberofrows;
    console.log('totalellipses = ' + totalellipses);
    for (var i = 1; i < totalellipses; i++) {
      // the first one
      if (ellipses.length === 0) {           
        const ellipse: GridEllipseComponent = new GridEllipseComponent(Number(canvasEl.clientLeft + recth), Number(canvasEl.clientTop + recth), recth, recth);
        ellipse.id = 1;
        ellipses[ellipses.length] = ellipse;
        ellipse.setMyPositionIds(numberofcolumns);
        ellipse.row = 1;
        ellipse.column = 1;
        // ellipse.showMyPosition();
        //console.log('setting up first ellipse ' + ellipse.id);
      }
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
      if (ellipses.length > 0) {       
        const ellipse: GridEllipseComponent = new GridEllipseComponent(canvasEl.clientLeft, canvasEl.clientTop, rectw, recth);
        ellipse.id = ellipses.length + 1;
        //console.log(ellipse.showMyPosition());
        //console.log('setting up ellipse ' + ellipse.id);
        ellipse.setMyPositionIds(numberofcolumns);
        
       if (ellipses.length % numberofcolumns === 0) {                
        ellipse.startX = Number(ellipses[0].startX);
        ellipse.startY = Number(ellipses[ellipse.westid - 1].startY) + (Number(ellipses[ellipse.westid - 1].h * 2)); 
         rowid += 1;     
         ellipse.row = rowid;            
         columnid = 0;         
         // console.log('started new row ' + rowid);
       }
       else {
        // console.log('adding another ellipse');
        // console.log('ellipse.westid = ' + ellipse.westid);
        // console.log('ellipses[0].startX = ' + ellipses[0].startX);
        // console.log('ellipses[ellipse.westid - 1].startX = ' + ellipses[ellipse.westid - 1].startX);
        // console.log('ellipses[ellipse.westid - 1].w = ' + ellipses[ellipse.westid - 1].w);
        ellipse.row = rowid;        
        ellipse.startX = Number(ellipses[ellipse.westid - 1].startX) + Number(recth * 2) + ctx.lineWidth;
         if(rowid === 1) {
          ellipse.startY = Number(ellipses[ellipse.westid - 1].startY); // + Number(ellipses[ellipse.westid - 1].h);
         }
          if(rowid > 1) {
            ellipse.startY = Number(ellipses[ellipse.northid - 1].startY) + Number(recth * 2);
        }
       }            
       columnid += 1;
       ellipse.column = columnid; 
       // ellipse.showMyPosition();
       ellipses[ellipses.length] = ellipse;
      }
    }
    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;
    for (const ellipse of ellipses) {
      //ctx.strokeRect(ellipse.startX, ellipse.startY, ellipse.w, ellipse.h);
      ctx.beginPath();
      // console.log('drawing ellipse ' + ellipse.id);
      //ctx.ellipse(ellipse.startX, ellipse.startY, rectw, recth, Math.PI / 4, 0, 2 * Math.PI);
      ctx.arc(ellipse.startX, ellipse.startY, recth, 2 * Math.PI, 0, false);
      ctx.fillStyle = Colors.GreenColors[5];
      ctx.fill();    
      
      // this will create a rectangle inside of the 
      var side = Math.sqrt(recth * recth * 2),  // calc side length of square
      half = side * 0.5;                      // position offset
     //  ctx.strokeRect(ellipse.startX - half, ellipse.startY - half, side, side);
      // console.log('using color ' + Colors.GreenColors[5]);
      // ctx.fillStyle = Colors.GreenColors[5];
     // ctx.fillRect(ellipse.startX - half, ellipse.startY - half, side, side)

     //  const excolors: string[] = ['#000000']; //exclude black     
      // this.useColorPaletteRect(Colors.PinkColors, excolors); 

      //totalarea += ellipse.w * ellipse.h;
    }
  }


  // example code for getting pixel info from a bitmap
  /**
   var data   = context.getImageData(0, 0, canvas.height, canvas.width);
var count  = 0;
var tmr    = null;
var length = data.length; 
(pix = function() { s
    var r = data[count + 0];
    var g = data[count + 1];
    var b = data[count + 2];
    var a = data[count + 3];
    var rgba = 'rgba('  + r + ' ,' + g + ' ,' + b +   ' ,' + a + ')'; 
    console.log(rgba); 
    if((count += 4) >= length) { 
        clearTimeout(tmr);
        return;
    }
    tmr = setTimeout(pix, 1000/30); //at 30 fps
})();
   */

   public saveCanvasAsPNG() {
    //var canvas = document.getElementById("mycanvas");
    // var img    = canvasEl.toDataURL("image/png");   
    var img    = canvasEl.toDataURL();   
  
   }

   /**
    * pass a Colors type from colors.ts as a parameter
    * 
    * @param colortype 
    */
   public useColorPaletteRect(colortype:string[], excludecolors:string[]) {   
     //console.log('colortype values = ' + colortype.entries.length);
      let color = colortype[Math.floor(Math.random() * (colortype.length))];             
      // for (const ex of excludecolors) {
      //     if(color === ex) {
      //       continue;
      //     }
      // }    
      let randomrectid = Math.floor(Math.random() * (rects.length));       
      ctx.fillStyle = color;
      ctx.fillRect(rects[randomrectid].startX, rects[randomrectid].startY, rects[randomrectid].w, rects[randomrectid].h);
     // ctx.strokeRect(rects[randomrectid].startX, rects[randomrectid].startY, rects[randomrectid].w, rects[randomrectid].h);
   }

   public useColorPaletteEllipse(colortype:string[], excludecolors:string[]) {   
    //console.log('colortype values = ' + colortype.entries.length);
     let color = colortype[Math.floor(Math.random() * (colortype.length))];             
     // for (const ex of excludecolors) {
     //     if(color === ex) {
     //       continue;
     //     }
     // }    
     let randomellipseid = Math.floor(Math.random() * (rects.length));       
     ctx.fillStyle = color; 
     ctx.arc(ellipses[randomellipseid].startX, ellipses[randomellipseid].startY, recth, 2 * Math.PI, 0, false);
     ctx.stroke();  
     ctx.fill();
     // ctx.fillRect(ellipses[randomellipseid].startX, rects[randomellipseid].startY, rects[randomellipseid].w, rects[randomellipseid].h);
    // ctx.strokeRect(rects[randomrectid].startX, rects[randomrectid].startY, rects[randomrectid].w, rects[randomrectid].h);
  }

   /**
    * create a random color
    */
  public showRandomRectsAuto() {
    let randomrectid = Math.floor(Math.random() * (rects.length));     
    
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

        ctx.fillStyle = color;
        ctx.fillRect(rects[randomrectid].startX, rects[randomrectid].startY, rects[randomrectid].w, rects[randomrectid].h);
        ctx.strokeRect(rects[randomrectid].startX, rects[randomrectid].startY, rects[randomrectid].w, rects[randomrectid].h);
  }

  /**
   * fill random rects with a specific color
   * 
   * @param color 
   */
  public showRandomRects(color:string) {
    let randomrectid = Math.floor(Math.random() * (rects.length));       
        ctx.fillStyle = color;
        ctx.fillRect(rects[randomrectid].startX, rects[randomrectid].startY, rects[randomrectid].w, rects[randomrectid].h);
        ctx.strokeRect(rects[randomrectid].startX, rects[randomrectid].startY, rects[randomrectid].w, rects[randomrectid].h);
  }

  public resizeCanvas()  {
    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;
  }

  public isNullOrUndefined(value: any): boolean {
    if (value === undefined || value === null) {
      return true;
    }
    return false;
  }

  public mouseDown(e: { button: string; pageX: number; pageY: number; }) {
    console.log(e.button + ' clicked');
    mouseX = e.pageX - canvasEl.offsetLeft;
    mouseY = e.pageY - canvasEl.offsetTop;    
    
    // console.log('mouseX: ' + mouseX);
    // console.log('mouseY: ' + mouseY);

    // for (const rect of rects) {
    //   ctx.fillStyle = WHITE; // white fill
    //   if(rect.modified) {
    //     console.log('modified rect found');
    //     ctx.fillStyle = BLUE;
    //   }
    //   ctx.strokeStyle = BLACK;
    //   ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
    //   ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
    // }

    for (const rect of rects) {
      if (Math.abs(mouseX - rect.startX) < closeEnough && Math.abs(mouseY - rect.startY) < closeEnough) {
        console.log('top left');
        dragTL = true;
        rect.selected = true;
        rect.zorder = 1;
        break;
      } else if (Math.abs(mouseX - rect.startX) < closeEnough && Math.abs(mouseY - rect.startY - rect.h) < closeEnough) {
        console.log('bottom left');
        dragBL = true;
        rect.selected = true;
        rect.zorder = 1;
        break;
      } else if (Math.abs(mouseX - (rect.startX + rect.w)) < closeEnough && Math.abs(mouseY - rect.startY) < closeEnough) {
        console.log('top right');
        dragTR = true;
        rect.selected = true;
        rect.zorder = 1;
        break;
      } else if (
        Math.abs(mouseX - (rect.startX + rect.w)) < closeEnough &&
        Math.abs(mouseY - (rect.startY + rect.h)) < closeEnough
      ) {
        console.log('bottom right');
        dragBR = true;
        rect.selected = true;
        rect.zorder = 1;
        break;
      }
    }
    
    for (const rect of rects) {
      if (mouseX >= rect.startX && mouseX <= rect.w + rect.startX && (mouseY >= rect.startY && mouseY <= rect.h + rect.startY)) {
        ctx.fillStyle = BLUE;
        ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
        ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
        rect.selected = true;
        selectedrectid = rect.id;
        console.log('selected rectid = ' + selectedrectid);
         // this will log the rect and its adjacent rects info
      //  rect.showMyPosition();  

        // highlight the adjacent rects
       /* ctx.fillStyle = GREEN; // greenish          
       if (rect.northwestid > 0 && rect.column > 1) {    
        ctx.fillRect(rects[rect.northwestid - 1].startX, rects[rect.northwestid - 1].startY,rects[rect.northwestid - 1].w, rects[rect.northwestid - 1].h);
        ctx.strokeRect(rects[rect.northwestid - 1].startX, rects[rect.northwestid - 1].startY,rects[rect.northwestid - 1].w, rects[rect.northwestid - 1].h);
       }

       if (rect.northid > 0) {
        ctx.fillRect(rects[rect.northid - 1].startX, rects[rect.northid - 1].startY,rects[rect.northid - 1].w, rects[rect.northid - 1].h);
        ctx.strokeRect(rects[rect.northid - 1].startX, rects[rect.northid - 1].startY,rects[rect.northid - 1].w, rects[rect.northid - 1].h);
       }

       if (rect.northeastid > 0 && rect.column < numberofcolumns) {
        ctx.fillRect(rects[rect.northeastid - 1].startX, rects[rect.northeastid - 1].startY,rects[rect.northeastid - 1].w, rects[rect.northeastid - 1].h);
        ctx.strokeRect(rects[rect.northeastid - 1].startX, rects[rect.northeastid - 1].startY,rects[rect.northeastid - 1].w, rects[rect.northeastid - 1].h);
       }

       if (rect.westid > 0 && rect.column > 1) {
        ctx.fillRect(rects[rect.westid - 1].startX, rects[rect.westid - 1].startY,rects[rect.westid - 1].w, rects[rect.westid - 1].h);
        ctx.strokeRect(rects[rect.westid - 1].startX, rects[rect.westid - 1].startY,rects[rect.westid - 1].w, rects[rect.westid - 1].h);
       }

       if (rect.eastid > 0 && rect.row <= numberofrows && rect.column < numberofcolumns) {
        ctx.fillRect(rects[rect.eastid - 1].startX, rects[rect.eastid - 1].startY,rects[rect.eastid - 1].w, rects[rect.eastid - 1].h);
        ctx.strokeRect(rects[rect.eastid - 1].startX, rects[rect.eastid - 1].startY,rects[rect.eastid - 1].w, rects[rect.eastid - 1].h);
       }

       if (rect.southwestid > 0 && rect.row < numberofrows && rect.column > 1) {
        ctx.fillRect(rects[rect.southwestid - 1].startX, rects[rect.southwestid - 1].startY,rects[rect.southwestid - 1].w, rects[rect.southwestid - 1].h);
        ctx.strokeRect(rects[rect.southwestid - 1].startX, rects[rect.southwestid - 1].startY,rects[rect.southwestid - 1].w, rects[rect.southwestid - 1].h);
       }

       if (rect.southid > 0 && rect.row < numberofrows) {
        ctx.fillRect(rects[rect.southid - 1].startX, rects[rect.southid - 1].startY,rects[rect.southid - 1].w, rects[rect.southid - 1].h);
        ctx.strokeRect(rects[rect.southid - 1].startX, rects[rect.southid - 1].startY,rects[rect.southid - 1].w, rects[rect.southid - 1].h);
       }

       if (rect.southeastid > 0 && rect.row < numberofrows && rect.column < numberofcolumns) {
        ctx.fillRect(rects[rect.southeastid - 1].startX, rects[rect.southeastid - 1].startY,rects[rect.southeastid - 1].w, rects[rect.southeastid - 1].h);
        ctx.strokeRect(rects[rect.southeastid - 1].startX, rects[rect.southeastid - 1].startY,rects[rect.southeastid - 1].w, rects[rect.southeastid - 1].h);
       }
       */
      }
    }
  }

  public mouseUp() {
    dragTL = dragTR = dragBL = dragBR = false;
    ctx.fillStyle = WHITE;
    ctx.strokeStyle = BLACK; // black border

    for (const rect of rects) {
      if (rect.id !== selectedrectid) {
      ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
      ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
      
        rect.zorder = 0;
      }
    }

    // draw the selected rects on top
    for (const rect of rects) {
      if (rect.modified) { // && (rect.id === selectedrectid)) {   
        ctx.fillStyle = BLUE;
        ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);        
        ctx.strokeStyle = BLACK; // black border
        ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);        
        rect.zorder = 0;
      }
    }
  }

  public mouseMove(e: { pageX: number; pageY: number; }) {
    mouseX = e.pageX - canvasEl.offsetLeft;
    mouseY = e.pageY - canvasEl.offsetTop;
    ctx.fillStyle = BLUE; //   blue
    // totalarea = 0;
    // rects.sort(function(a, b){return b.zorder - a.zorder});

    for (const rect of rects) {
      // let rectarea = rect.w * rect.h;
      // console.log('total area = ' + totalarea);
      //  if(!rect.selected && rect.zorder === 0) {
      //   //console.log('drawing rect ' + rect.id);
      //   ctx.clearRect(rect.startX - 2, rect.startY - 2, rect.w + 4, rect.h + 4);
      //        ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
      //  }

      if ((rect.id === selectedrectid) && 
          (dragTL || dragTR || dragBL || dragBR)) {      
            rect.modified = true;
        ctx.clearRect(rect.startX - ctx.lineWidth, rect.startY - ctx.lineWidth, rect.w + (ctx.lineWidth * 2), rect.h + (ctx.lineWidth * 2));
        if (dragTL) {
          rect.w += rect.startX - mouseX;
          rect.h += rect.startY - mouseY;
          rect.startX = mouseX;
          rect.startY = mouseY;
        } else if (dragTR) {
          rect.w = Math.abs(rect.startX - mouseX);
          rect.h += rect.startY - mouseY;
          rect.startY = mouseY;
        } else if (dragBL) {
          rect.w += rect.startX - mouseX;
          rect.h = Math.abs(rect.startY - mouseY);
          rect.startX = mouseX;
        } else if (dragBR) {
          rect.w = Math.abs(rect.startX - mouseX);
          rect.h = Math.abs(rect.startY - mouseY);
        }

        // don't draw past the original boundaries
        // if (mouseX <= rect.originalstartX || mouseY >= rect.originalstartY) {

        // } else {
        // ctx.fillStyle = BLUE; //   blue
        // ctx.beginPath();
        // ctx.rect(rect.startX, rect.startY, rect.w, rect.h);
        // ctx.stroke();
        // ctx.globalAlpha = 1.0;
        //  ctx.fillStyle = 'rgba(225,225,225,0.5)';

        selectedrectarea = rect.w * rect.h;

        ctx.clearRect(rect.startX - 2, rect.startY - 2, rect.w + 4, rect.h + 4);
        ctx.strokeStyle = BLUEVIOLET;
        ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
              
      } else if (!rect.selected) { // not working that well
        // if (selectedrectarea > 0) {
        //   // console.log('rect area = ' + selectedrectarea);
        //   let remainingarea = (totalarea - selectedrectarea) / (rects.length - 1);
        //   // console.log('remaining area for each rect = ' + remainingarea);

        //   ctx.clearRect(rect.startX - 2, rect.startY - 2, rect.w + 4, rect.h + 4);
        //   ctx.strokeStyle = BLUEVIOLET; 
        //   let previousrectid = rect.id - 2;
        //   let previousrect = rects[previousrectid];
        //   // console.log('rect id = ' + rect.id);
        //   // console.log('previousrect id = ' + previousrect.id);

        //   rect.startX = previousrect.startX + previousrect.w;
        //   rect.startY = previousrect.startY;
        //   //rect.startY = rect[previousrectid].;
        //   // let newx = rect.w + (remainingarea / rect.originalw);
        //   rect.w = remainingarea / rect.originalw;
        //   rect.h = remainingarea / rect.originalh;
        //   ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
        // }
      } else {
        // ctx.clearRect(rect.startX - 2, rect.startY - 2, rect.w + 4, rect.h + 4);
        // ctx.strokeStyle = BLUEVIOLET; // blue-violet
        // ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
      } 
    }

    // for (const rect of rects) {
    //   totalarea += rect.w * rect.h;
    // }
  }

  // drawCircle(x, y, radius) {
  //   ctx.fillStyle = BLACK;
  //   ctx.beginPath();
  //   ctx.arc(x, y, radius, 0, 2 * Math.PI);
  //   ctx.fill();
  // }

  // // drawHandles() {
  // //   this.drawCircle(rect1.startX, rect1.startY, closeEnough);
  // //   this.drawCircle(rect1.startX + rect1.w, rect1.startY, closeEnough);
  // //   this.drawCircle(rect1.startX + rect1.w, rect1.startY + rect1.h, closeEnough);
  // //   this.drawCircle(rect1.startX, rect1.startY + rect1.h, closeEnough);
  // // }

  // checkCloseEnough(p1, p2) {
  //   return Math.abs(p1 - p2) < closeEnough;
  // }

  // drawOnCanvas(
  //   prevPos: { x: number; y: number },
  //   currentPos: { x: number; y: number }
  // ) {
  //   // incase the context is not set
  //   if (!ctx) {
  //     return;
  //   }

  //   // start our drawing path
  //   ctx.beginPath();

  //   // we're drawing lines so we need a previous position
  //   if (prevPos) {
  //     // sets the start point
  //     ctx.moveTo(prevPos.x, prevPos.y); // from
  //     // draws a line from the start pos until the current position
  //     ctx.lineTo(currentPos.x, currentPos.y);

  //     // strokes the current path with the styles we set earlier
  //     ctx.stroke();
  //   }
  // }

  public ngOnDestroy() {
    // this will remove event lister when this component is destroyed
    this.drawingSubscription.unsubscribe();
  }
}