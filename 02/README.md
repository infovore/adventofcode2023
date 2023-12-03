# Day 02

Really wanted to do this with some kind of parser - anything to avoid the sea of regex and array indices. In the end, pt1/pt2 approach it with Lots Of Functions, but I rewrote pt2 once I discovered Ohm would let you define parsers inline. Given we're using a fixed format, I'd rather write a parser for that format, and then use it expressively, than hack away at arrays. That was the approach I wanted to take first time around.
