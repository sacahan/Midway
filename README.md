# README

## Requirements

Requirement|Value|
:---:|:---:|
Node.js| v8.x or above |

## Install

    $ cd {Midway_Path}
    $ npm install
    $ npm link

## Execute

### 1. Command line with arguments

    $ midway -u {url} [options]

### 2. Local file pipe

    $ cat {file_path} | midway [options]

## Configuration

### 1. Command Options
    
    Usage: midway [options]
      
        Options:
      
          -V, --version     output the version number
          -u, --url <u>     set HTML URL
          -o, --output [o]  set output path (default: ./output.txt)
          -r, --ruleId [r]  apply rule id of rules.json (default: ALL rules)
          -h, --help        output usage information

### 2. rules.json

You can compose your SEO rules in `{Midway_Path}/rules.json` and assign several id of rules as arguments when launching in command line.

Name|Value|Type|Required
:---:|:---|:---:|:---:|
 id | Each rule object must assign a id and it would be use in command argument. ex. `midway -r {id}` | String | Yes |
 selector | Midway use `CSS Selector` expression to detect HTML features like jQuery. ex. `img[alt='']` | String | Yes |
 threshold | A selector may get more than one result, user can set a threshold value for rule match.  | Integer | Yes | 
 operator | Midway provide 6 logical operators to evaluate `selector's results and threshold`, if operator returns the boolean value true meaning the rule detected.  | String | Yes |  operator | Midway provide 6 logical operators to evaluate selector's results and threshold, if operator returns the boolean value true meaning the rule detected.  | String | Yes | 
 message | You can edit a message and set placeholder (ex. {0}) to show how many results the selectors detected. The message will write into the final output.  | String | Yes |  operator | Midway provide 6 logical operators to evaluate selector's results and threshold, if operator returns the boolean value true meaning the rule detected.  | String | Yes | 
 selectors | The `selectors` allows you to combine several `rule objects` into it if you need complicated detected rules.  | Array | No |  
 
### 3. operator

Expression|Logical Meaning|Symbol|
:---:|:---:|:---:|
eq | Equal To | a == b |
ne | Not Equal To | a != b |
gt | Greater Than  | a > b |
ge | Greater Than or Equal To | a >= b |
lt | Less Than | a < b |
le | Less Than or Equal To | a <= b |
  
 
## Example

    // To detect URL by rule 1 and 2. 
    $ midway -u https://www.tstartel.com/CWS/roaming.php -r 1 -r 2
        
    // Using `cat` command pipes to midway with rule 3     
    $ cat ~/Desktop/family.html | midway -r 3
    
    // Set ouput file location
    $ midway -u https://www.tstartel.com/CWS/roaming.php -o ~/Desktop/result.log
    
    // Detected results pipe to other program
    $ midway -u https://www.tstartel.com/CWS/roaming.php | grep img 