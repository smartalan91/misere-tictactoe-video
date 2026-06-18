import {makeProject} from '@motion-canvas/core';

import intro from './scenes/01-intro?scene';
import n1 from './scenes/02-n1?scene';
import n2 from './scenes/03-n2?scene';
import n34 from './scenes/04-n34?scene';
import overview from './scenes/05-overview?scene';
import oddSymmetry from './scenes/06-odd-symmetry?scene';
import oddGrouping from './scenes/07-odd-grouping?scene';
import even from './scenes/08-even?scene';
import conclusion from './scenes/09-conclusion?scene';

export default makeProject({
  scenes: [
    intro,
    n1,
    n2,
    n34,
    overview,
    oddSymmetry,
    oddGrouping,
    even,
    conclusion,
  ],
});
