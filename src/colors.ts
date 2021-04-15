import { Component } from '@angular/core';
import { CONTEXT } from '@angular/core/src/render3/interfaces/view';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })

export class Colors  {

   // public PinkColors: Map<string, string>;
// now you can use it:
// yourVar = new Map<string, string>();
public Colors() {    
    
}

// public addPinkColors() {    
//     this.PinkColors = new Map<string, string>();
//     this.PinkColors['Pink'] = <string> '#FFC0CB';
//     this.PinkColors['LightPink'] = <string> '#FFB6C1', //255 182 193
//     this.PinkColors['HotPink'] = <string> '#FF69B4', //255 105 180
//     this.PinkColors['DeepPink'] = <string> '#FF1493', //255  20 147
//     this.PinkColors['PaleVioletRed'] = <string> '#DB7093', //219 112 147
//     this.PinkColors['MediumVioletRed'] = <string> '#C71585' //199  21 133
// }
     
static PinkColors:string[] = [
    '#FFC0CB', //255 192 203 'Pink'
    '#FFB6C1', //255 182 193 'LightPink':
    '#FF69B4', //255 105 180 'HotPink':
    '#FF1493', //255  20 147 'DeepPink':
    '#DB7093', //219 112 147 'PaleVioletRed':
    '#C71585' //199  21 133 'MediumVioletRed':
]

static RedColors:string[] = [
    '#FFA07A', //255 160 122 'LightSalmon':
    '#FA8072', //250 128 114 'Salmon':
    '#E9967A', //233 150 122 'DarkSalmon':
    '#F08080', //240 128 128 'LightCoral':
    '#CD5C5C', //205  92  92 'IndianRed':
    '#DC143C', //220  20  60 'Crimson':
    '#B22222', //178  34  34 'Firebrick':
    '#8B0000', //139   0   0 'DarkRed':
    '#FF0000' //255   0   0 'Red':
]

static OrangeColors:string[] = [
    '#FF4500', //255  69   0 'OrangeRed':
    '#FF6347', //255  99  71 'Tomato':
    '#FF7F50', //255 127  80 'Coral':
    '#FF8C00 ', //255 140   0 'DarkOrange':
    '#FFA500' //255 165   0 'Orange':
]

static YellowColors:string[] = [
    '#FFFF00', //255 255   0 'Yellow':
    '#FFFFE0', //255 255 224 'LightYellow':
    '#FFFACD', //255 250 205 'LemonChiffon':
    '#FAFAD2', //250 250 210 'LightGoldenrodYellow':
    '#FFEFD5', //255 239 213 'PapayaWhip':
    '#FFE4B5', //255 228 181 'Moccasin':
    '#FFDAB9', //255 218 185 'PeachPuff':
    '#EEE8AA', //238 232 170 'PaleGoldenrod':
    '#F0E68C', //240 230 140 'Khaki':
    '#BDB76B', //189 183 107 'DarkKhaki':
    '#FFD7 00' //255 215   0 'Gold':
]

static BrownColors:string[] = [
    '#FFF8DC', //255 248 220 'Cornsilk':
    '#FFEBCD', //255 235 205 'BlanchedAlmond':
    '#FFE4C4', //255 228 196 'Bisque':
    '#FFDEAD', //255 222 173 'NavajoWhite':
    '#F5DEB3', //245 222 179 'Wheat':
    '#DEB887', //222 184 135 'Burlywood':
    '#D2B48C', //210 180 140 'Tan':
    '#BC8F8F', //188 143 143 'RosyBrown':
    '#F4A460', //244 164  96 'SandyBrown':
    '#DAA520', //218 165  32 'Goldenrod':
    '#B8860B', //184 134  11 'DarkGoldenrod':
    '#CD853F', //205 133  63 'Peru':
    '#D2691E', //210 105  30 'Chocolate':
    '#8B4513', //139  69  19 'SaddleBrown':
    '#A0522D', //160  82  45 'Sienna':
    '#A52A2A', //165  42  42 'Brown':
    '#800000', //128   0   0 'Maroon':
]

static PurpleColors:string[] = [
    'E6E6FA', //230 230 250 'Lavender':
    '#D8BFD8', //216 191 216 'Thistle':
    '#DDA0DD', //221 160 221 'Plum':
    '#EE82EE', //238 130 238 'Violet':
    '#DA70D6', //218 112 214 'Orchid':
    '#FF00FF', //255   0 255 'Fuchsia':
    '#FF00FF', //255   0 255 'Magenta':
    '#BA55D3', //186  85 211 'MediumOrchid':
    '#9370DB', //147 112 219 'MediumPurple':
    '#8A2BE2', //138  43 226 'BlueViolet':
    '#9400D3', //148   0 211 'DarkViolet':
    '#9932CC', //153  50 204 'DarkOrchid':
    '#8B008B', //139   0 139 'DarkMagenta':
    '#800080', //128   0 128 'Purple':
    '#4B0082', // 75   0 130 'Indigo':
    '#483D8B', // 72  61 139 'DarkSlateBlue':
    '#6A5ACD', //106  90 205 'SlateBlue':
    '#7B68EE', //123 104 238 'MediumSlateBlue':
]

static WhiteColors:string[] = [
    'FFFFFF', //255 255 255 'White':
    '#FFFAFA', //255 250 250 'Snow':
    '#F0FFF0', //240 255 240 'Honeydew':
    '#F5FFFA', //245 255 250 'MintCream':
    '#F0FFFF', //240 255 255 'Azure':
    '#F0F8FF', //240 248 255 'AliceBlue':
    '#F8F8FF', //248 248 255 'GhostWhite':
    '#F5F5F5', //245 245 245 'WhiteSmoke':
    '#FFF5EE', //255 245 238 'Seashell':
    '#F5F5DC', //245 245 220 'Beige':
    '#FDF5E6', //253 245 230 'OldLace':
    '#FFFAF0', //255 250 240 'FloralWhite':
    '#FFFFF0', //255 255 240 'Ivory':
    '#FAEBD7', //250 235 215 'AntiqueWhite':
    '#FAF0E6', //250 240 230 'Linen':
    '#FFF0F5', //255 240 245 'LavenderBlush':
    '#FFE4E1', //255 228 225 'MistyRose':
]

static GreyBlackColors:string[] = [
    '#DCDCDC', //220 220 220 'Gainsboro':
    '#D3D3D3', //211 211 211 'LightGray':
    '#C0C0C0', //192 192 192 'Silver':
    '#A9A9A9', //169 169 169 'DarkGray':
    '#808080', //128 128 128 'Gray':
    '#696969', //105 105 105 'DimGray':
    '#778899', //119 136 153 'LightSlateGray':
    '#708090', //112 128 144 'SlateGray':
    '#2F4F4F', // 47  79  79 'DarkSlateGray':
    '#000000', //  0   0   0 'Black':
]

static GreenColors:string[] = [
    '556B2F', // 85 107  47 'DarkOliveGreen':
    '#808000', //128 128   0 'Olive':
    '#6B8E23', //107 142  35 'OliveDrab':
    '#9ACD32', //154 205  50 'YellowGreen':
    '#32CD32', // 50 205  50 'LimeGreen':
    '#00FF00', //  0 255   0 'Lime':
    '#7CFC00', //124 252   0 'LawnGreen':
    '#7FFF00', //127 255   0 'Chartreuse':
    '#ADFF2F', //173 255  47 'GreenYellow':
    '#00FF7F', //  0 255 127 'SpringGreen':
    '#00FA9A', //  0 250 154 'MediumSpringGreen':
    '#90EE90', //144 238 144 'LightGreen':
    '#98FB98', //152 251 152 'PaleGreen':
    '#8FBC8F', //143 188 143 'DarkSeaGreen':
    '#66CDAA', //102 205 170 'MediumAquamarine':
    '#3CB371', // 60 179 113 'MediumSeaGreen':
    '#2E8B57', // 46 139  87 'SeaGreen':
    '#228B22', // 34 139  34 'ForestGreen':
    '#008000', //  0 128   0 'Green':
    '#006400', //  0 100   0 'DarkGreen':
]

static CyanColors:string[] = [
    '#00FFFF', //  0 255 255 'Aqua':
    '#00FFFF', //  0 255 255 'Cyan':
    '#E0FFFF', //224 255 255 'LightCyan':
    '#AFEEEE', //175 238 238 'PaleTurquoise':
    '#7FFFD4', //127 255 212 'Aquamarine':
    '#40E0D0', // 64 224 208 'Turquoise':
    '#48D1CC', // 72 209 204 'MediumTurquoise':
    '#00CED1', //  0 206 209 'DarkTurquoise':
    '#20B2AA', // 32 178 170 'LightSeaGreen':
    '#5F9EA0', // 95 158 160 'CadetBlue':
    '#008B8B', //  0 139 139 'DarkCyan':
    '#008080', //  0 128 128 'Teal':
]

static BlueColors:string[] = [
    '#B0C4DE', //176 196 222 'LightSteelBlue':
    '#B0E0E6', //176 224 230 'PowderBlue':
    '#ADD8E6', //173 216 230 'LightBlue':
    '#87CEEB', //135 206 235 'SkyBlue':
    '#87CEFA', //135 206 250 'LightSkyBlue':
    '#00BFFF', //  0 191 255 'DeepSkyBlue':
    '#1E90FF', // 30 144 255 'DodgerBlue':
    '#6495ED', //100 149 237 'CornflowerBlue':
    '#4682B4', // 70 130 180 'SteelBlue':
    '#4169E1', // 65 105 225 'RoyalBlue':
    '#0000FF', //  0   0 255 'Blue':
    '#0000CD', //  0   0 205 'MediumBlue':
    '#00008B', //  0   0 139 'DarkBlue':
    '#000080', //  0   0 128 'Navy':
    '#191970', // 25  25 112 'MidnightBlue':
]
    
}