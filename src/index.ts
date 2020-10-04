type Block = [number, number]; //addr, size
let blocks: Block[];
let buffer_size: number;
let ring_buffer: string[];
let head: number;

function init() {
  console.log("hey!");
  buffer_size = +(<HTMLInputElement>document.getElementById("buffer_size")!)
    .value;
  // alert(buffer_size);
  reset_ring_buffer();
  blocks = [];
  head = 0;
  document.getElementById("ring_buffer")!.innerHTML = ring_buffer.join("");
}
function reset_ring_buffer() {
  ring_buffer = [" "];
  let i = buffer_size;
  while (i > 0) {
    ring_buffer.push("*");
    ring_buffer.push(" ");
    i--;
  }
}

function push_block(block_size: number) {
  if (block_size > buffer_size) {
    console.error("size too big!");
    return;
  }
  //somewhere in the buffer can fit the block
  if (head + block_size > buffer_size) {
    //the rest segment of the buffer does not have enough space
    while (true) {
      if (!blocks.length) {
        break;
      }
      if (blocks[0][0] >= head && blocks[0][0] < buffer_size) {
        //this block is on the abandon zone
        blocks.shift();
      } else {
        break;
      }
    }
    head = 0;
  }
  //head doesn't need to move!
  //traverse the Blocks array and delete the first element until the start address is out of scope
  while (true) {
    if (
      !blocks.length ||
      blocks[0][0] < head ||
      blocks[0][0] >= head + block_size
    ) {
      let new_block: Block = [head, block_size];
      blocks.push(new_block);
      head = head + block_size;
      break;
    } else {
      let overwritten_block = blocks.shift();
    }
  }
  console.log(blocks);
}

function push_new_block() {
  console.log("hey2!");
  let new_block_size: number = +(<HTMLInputElement>(
    document.getElementById("new_block_size")!
  )).value;
  push_block(new_block_size);
  reset_ring_buffer();
  blocks.forEach((cur_block) => {
    let start_addr = cur_block[0];
    let end_addr = start_addr + cur_block[1];
    let left_boundary_index = start_addr * 2;
    let right_boundary_index = end_addr * 2;
    ring_buffer[left_boundary_index] = "|";
    ring_buffer[right_boundary_index] = "|";
    for (let _i = left_boundary_index + 1; _i < right_boundary_index; ) {
      ring_buffer[_i] = "^";
      _i += 2;
    }
    console.log(left_boundary_index + " " + right_boundary_index);
  });
  document.getElementById("ring_buffer")!.innerHTML = ring_buffer.join("");
}
