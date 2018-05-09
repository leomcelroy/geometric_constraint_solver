import CharStream, { isEOS } from './char-stream';
import Reader, { getCurrentReadtable, setCurrentReadtable } from './reader';
import Readtable, { EmptyReadtable } from './readtable';

export { CharStream, Reader, Readtable, EmptyReadtable, isEOS, getCurrentReadtable, setCurrentReadtable };
