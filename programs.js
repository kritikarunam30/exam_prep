// ============================================================
//  PROGRAMS DATA  --  THE ONLY PLACE YOU NEED TO EDIT
// ============================================================
//  Change a title, replace code, add an entry, or delete an entry.
//
//  HOW TO PASTE CODE
//  - Use:  code: String.raw`...paste here...`
//  - Backslashes (\n, \t, \\, C:\path) can be pasted exactly as they are.
//  - Don't put a backtick (`) or the characters ${ inside the code.
//    (Python, C, C++, Java etc. almost never need them.)
//
//  RARE CASE: code that contains a backtick or ${  (e.g. JS or shell)
//  - Do NOT use String.raw for that entry (it would keep the extra backslash).
//  - Use a normal template literal  code: `...`  and escape these:
//        \   ->  \\
//        `   ->  \`
//        ${  ->  \${
//    See the last example below.
//  - Start the code right after the opening backtick (no leading newline),
//    and end it right before the closing backtick, to avoid extra blank lines.
// ============================================================

const programs = [
  {
    title: "Hello World (Python)",
    code: String.raw`print("Hello, World!")`
  },
  {
    title: "Factorial (Python)",
    code: String.raw`def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

for i in range(1, 6):
    print(f"{i}! = {factorial(i)}")
`
  },
  {
    title: "Special characters test (C)",
    code: String.raw`#include <stdio.h>
#include <string.h>

int main() {
	char c = '\'';
	char *s = "Tab:\t| Newline:\n| Backslash:\\ | Quote:\" | Amp: &amp; &lt;";
	printf("%s\n", s);
	if (strlen(s) > 0 && c != '"') { printf("a < b && b > c\n"); }
	return 0;
}
`
  },
  {
    title: "Escaped backtick example (JavaScript)",
    code: `const name = 'World';
const msg = \`Hello, \${name}!\\n\`;
console.log(msg);
`
  }
];
