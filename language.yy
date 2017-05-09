%lex

NUMBERNAME [cC][iI][sS][lL][oO][\-][a-zA-Z][a-zA-Z0-9\_]*
BOOLNAME [pP][rR][aA][vV][dD][iI][vV][oO][sS][tT][\-][a-zA-Z][a-zA-Z0-9\_]*
COLORNAME [fF][aA][rR][bB][aA][\-][a-zA-Z][a-zA-Z0-9\_]*
ROTATIONNAME [sS][mM][eE][rR][\-][a-zA-Z][a-zA-Z0-9\_]*
NAME [a-zA-Z][a-zA-Z0-9\_]*
NUMBER [0-9]+

%options flex case-insensitive

%%
"//".* {/* ignore */}
"/*"((\*+[^/*])|([^*]))*\**"*/" {/* ignore */}

{COLORNAME} {return 'COLORNAME';}
{NUMBERNAME} {return 'NUMBERNAME';}
{BOOLNAME} {return 'BOOLNAME';}
{ROTATIONNAME} {return 'ROTATIONNAME';}

"{" {return '{';}
"}" {return '}';}
"(" {return '(';}
")" {return ')';}
"," {return ',';}
"+" {return '+';}
"-" {return '-';}
"*" {return '*';}
"/" {return 'DIV';}
"%" {return '%';}
"|" {return 'ABS';}
"<="    {return 'LT';}
">="    {return 'GT';}
"<" {return '<';}
">" {return '>';}
":=" {return 'ASSIGN';}
"!=" {return 'NOTEQUALS';}
"=" {return 'EQUALS';}
"NEPRAVDA"/[^a-zA-Z0-9_] {return 'FALSE';}
"PRAVDA"/[^a-zA-Z0-9_]  {return 'TRUE';}
"A"/[^a-zA-Z0-9_]     {return 'AND';}
"ALEBO"/[^a-zA-Z0-9_] {return 'OR';}
"KROK"/[^a-zA-Z0-9_]  {return 'STEP';}
"OTOC"/[^a-zA-Z0-9_] {return 'TURN';}
"POLOZ"/[^a-zA-Z0-9_] {return 'PUT';}
"ZOBER"/[^a-zA-Z0-9_] {return 'PICK';}
"PRIKAZ"/[^a-zA-Z0-9_] {return 'DEFCOMMAND';}
"AK"/[^a-zA-Z0-9_]    {return 'IF';}
"TAK"/[^a-zA-Z0-9_]   {return 'THEN';}
"INAK"/[^a-zA-Z0-9_]  {return 'ELSE';}
"OPAKUJ"/[^a-zA-Z0-9_] {return 'REPEAT';}
"PRERUS"/[^a-zA-Z0-9_] {return 'BREAK';}
"VRAT"/[^a-zA-Z0-9_] {return 'RETURN';}
"SA"/[^a-zA-Z0-9_] {return 'SELF';}
"POKIAL"/[^a-zA-Z0-9_] {return 'WHILE';}
"VYPNI"/[^a-zA-Z0-9_] {return 'TURNOFF';}
"NIE"/[^a-zA-Z0-9_]    {return 'NOT';}
"!"/[^a-zA-Z0-9_]    {return 'NOT';}
"JE"/[^a-zA-Z0-9_]     {return 'IS';}
"MA"/[^a-zA-Z0-9_]     {return 'HAS';}
"NEMA"/[^a-zA-Z0-9_]   {return 'NOTHAS';}
"CERVENA"/[^a-zA-Z0-9_] {yytext = "red"; return 'COLOR';}
"ZELENA"/[^a-zA-Z0-9_] {yytext = "green"; return 'COLOR';}
"MODRA"/[^a-zA-Z0-9_] {yytext = "blue"; return 'COLOR';}
"VYSKA"/[^a-zA-Z0-9_] {return 'HEIGHT';}
"TEHLA"/[^a-zA-Z0-9_] {return 'BRICK';}
"STENA"/[^a-zA-Z0-9_] {return 'WALL';}
"JAMA"/[^a-zA-Z0-9_]  {return 'CLIFF';}
"DIERA"/[^a-zA-Z0-9_] {return 'HOLE';}
"VOLNO"/[^a-zA-Z0-9_] {return 'FREE';}
"VSADE"/[^a-zA-Z0-9_] {return 'GLOBAL';}
"OTOCENY"/[^a-zA-Z0-9_] {return 'FACING';}
"VLAVO"/[^a-zA-Z0-9_] {return 'LEFT';}
"VPRAVO"/[^a-zA-Z0-9_] {return 'RIGHT';}
"HORE"/[^a-zA-Z0-9_] {return 'UP';}
"DOLE"/[^a-zA-Z0-9_] {return 'DOWN';}
"^" {return 'GLOBAL';}

{NAME} {return 'NAME';}
{NUMBER} {return 'NUMBER';}

\s+                      {/* ignore */}
<<EOF>>                  {return 'EOF';}

/lex

%start code

%nonassoc IF_THEN
%nonassoc ELSE

%left OR
%left AND
%left EQUALS NOTEQUALS
%left LT GR '>' '<'
%left '+' '-'
%left '*' DIV '%'
%right MINUS NOT

%%
code : GLOBAL '{' globalvars '}' definitions commands EOF
     {
        $$ = $5;
        $$.__globalvars__ = $3;
        $$.__globalvars__['commands']=[];
        $$.__globalvars__['params']=[];
        $$.__main__ = {'params':[], 'commands':$6.concat([{'command':'turn-off'}])};
        return $$;
     }
     | definitions commands EOF
     {
        $$ = $1;
        $$.__globalvars__ = [];
        $$.__globalvars__['commands']=[];
        $$.__globalvars__['params']=[];
        $$.__main__ = {'params':[], 'commands':$2.concat([{'command':'turn-off'}])};
        return $$;
     }
     | GLOBAL '{' globalvars '}' commands EOF
     {
        $$ = new Object();
        $$.__globalvars__ = $3;
        $$.__globalvars__['commands']=[];
        $$.__globalvars__['params']=[];
        $$.__main__ = {'params':[], 'commands':$5.concat([{'command':'turn-off'}])};
        return $$;
     }
     | commands EOF
     {
        $$ = new Object();
        $$.__globalvars__ = [];
        $$.__globalvars__['commands']=[];
        $$.__globalvars__['params']=[];
        $$.__main__ = {'params':[], 'commands': $1.concat([{'command':'turn-off'}])};
        return $$;
     }
     
;

/* GLOBAL VARIABLES */


globalvars : 
           {
                $$ = []
           }
           | globalvars1
           {
                $$ = $1;
           }
;

globalvars1 : globalvar
            {
                $$ = $1;
            }
            | globalvars1 numvarassign
            {
                $$ = $1;
                $$.push($2);
            }
            | globalvars1 colorvarassign
            {
                $$ = $1;
                $$.push($2);
            }
            | globalvars1 boolvarassign
            {
                $$ = $1;
                $$.push($2);
            }
            | globalvars1 rotationvarassign
            {
                $$ = $1;
                $$.push($2);
            }
;

globalvar : numvarassign
          {
              $$ = [$1];
          }
          | colorvarassign
          {
              $$ = [$1];
          }
          | boolvarassign
          {
              $$ = [$1];
          }
          | rotationvarassign
          {
              $$ = [$1];
          }
;

/* FUNCTION DEFINITIONS */

definitions : definition
             {
                 $$ = new Object();
                 $$[$1.name] = {
                       'params': $1.params,
                       'commands': $1.commands
                       };
             }
            | definitions definition
            {
                $$ = $1;
                $$[$2.name] = {
                             'params': $2.params,
                             'commands': $2.commands
                              };
            }
;

definition : DEFCOMMAND NAME command
           {
                $$ = {
                    'name' : $2.toLowerCase(),
                    'params' : [],
                    'commands' : $3.concat([{'command':'return'}])
                };
           }
           | DEFCOMMAND NAME '(' params ')' command
           {
                $$ = {
                    'name' : $2.toLowerCase(),
                    'params' : $4,
                    'commands' : $6.concat([{'command':'return'}])
                };
           }
;   

params : /* */
       {
            $$ = [];
       }
       | params1
       {
            $$ = $1;
       }
;

params1 : params1 ',' NUMBERNAME
        {
             $$ = $1;
             $$.push({'type':'number','value':$3.toLowerCase()});
        }
        | NUMBERNAME
        {
             $$ = [{'type':'number','value':$1.toLowerCase()}];
        }
        | params1 ',' COLORNAME
        {
             $$ = $1;
             $$.push({'type':'color','value':$3.toLowerCase()});
        }
        | COLORNAME
        {
             $$ = [{'type':'color','value':$1.toLowerCase()}];
        }
        | params1 ',' BOOLNAME
        {
             $$ = $1;
             $$.push({'type':'bool','value':$3.toLowerCase()});
        }
        | BOOLNAME
        {
             $$ = [{'type':'bool','value':$1.toLowerCase()}];
        }
        | params1 ',' ROTATIONNAME
        {
             $$ = $1;
             $$.push({'type':'rotation','value':$3.toLowerCase()});
        }
        | ROTATIONNAME
        {
             $$ = [{'type':'rotation','value':$1.toLowerCase()}];
        }
;

/* COMMANDS */

commands : /* */ 
         { 
            $$ = [];
         }
         | commands1
         {
            $$ = $1;
         }
;

commands1 : commands1 command
          {
            $$ = $1.concat($2);
          }
          | command
          {
             $$ = $1;
          }
;

command : colorvarassign
        { $$ = [$1]; }
        | numvarassign
        { $$ = [$1]; }
        | boolvarassign
        { $$ = [$1]; }
        | rotationvarassign
        { $$ = [$1]; }
        | GLOBAL colorvarassign
        { $2['global']=true; $$ = [$2]; }
        | GLOBAL numvarassign
        { $2['global']=true; $$ = [$2]; }
        | GLOBAL boolvarassign
        { $2['global']=true; $$ = [$2];  }
        | GLOBAL rotationvarassign
        { $2['global']=true; $$ = [$2];  }
        | simplecommand
        {
            $$ = [{
                'command' : $1,
                'source' : {
                    'first_line'   : @1.first_line,
                    'first_column' : @1.first_column,
                    'last_line'   : @1.last_line,
                    'last_column' : @1.last_column
                }
            }];
        }
        | IF condition THEN command %prec IF_THEN
        {
            $$ = [{
                    'command' : 'if',
                    'value' : $2,
                    'else' : $4.length+1,
                    'source' : {
                        'first_line'   : @1.first_line,
                        'first_column' : @1.first_column,
                        'last_line'   : @2.last_line,
                        'last_column' : @2.last_column
                    }
                }].concat($4);
        }
        | IF condition THEN command ELSE command
        {
            $$ = [{
                'command' : 'if',
                'value' : $2,
                'else' : $4.length+2,
                'source' : {
                    'first_line'   : @1.first_line,
                    'first_column' : @1.first_column,
                    'last_line'   : @2.last_line,
                    'last_column' : @2.last_column
                }
            }].concat($4);
            $$.push({'command' : 'jump', 'value': $6.length+1});
            $$ = $$.concat($6);
        }
        | WHILE condition THEN command
        {
            $$ = [{
                'command' : 'while',
                'value' : $2,
                'end' : $4.length+2,
                'source' : {
                    'first_line'   : @1.first_line,
                    'first_column' : @1.first_column,
                    'last_line'   : @3.last_line,
                    'last_column' : @3.last_column
                }
            }].concat($4);
            for (var i=0; i<$4.length; i++) if (($4[i].command=='break')&&($4[i].value==0))
                $4[i].value=-i-1;
            $$.push({'command' : 'jump', 'value': -$4.length-1});
        }
        | REPEAT command
        {
            $$ = [{
                'command' : 'repeat',
                'value' : 0,
                'infinite' : true,
                'end' : $2.length+2,
                'source' : {
                    'first_line'   : @1.first_line,
                    'first_column' : @1.first_column,
                    'last_line'   : @1.last_line,
                    'last_column' : @1.last_column
                }
            }].concat($2);         
            for (var i=0; i<$2.length; i++) if (($2[i].command=='break')&&($2[i].value==0))
                $2[i].value=-i-1;
            $$.push({'command' : 'jump', 'value': -$2.length-1});
        }
        | REPEAT expression command
        {
            $$ = [{
                'command' : 'repeat',
                'value' : $2,
                'infinite' : false,
                'end' : $3.length+2,
                'source' : {
                    'first_line'   : @1.first_line,
                    'first_column' : @1.first_column,
                    'last_line'   : @2.last_line,
                    'last_column' : @2.last_column
                }
            }].concat($3);
            for (var i=0; i<$3.length; i++) if (($3[i].command=='break')&&($3[i].value==0))
                $3[i].value=-i-1;
            $$.push({'command' : 'jump', 'value': -$3.length-1});
        }
        | BREAK
        {
            $$ = [{
                'command' : 'break',
                'value' : 0,
                'source' : {
                    'first_line'   : @1.first_line,
                    'first_column' : @1.first_column,
                    'last_line'   : @1.last_line,
                    'last_column' : @1.last_column
                }
            }];
        }
        | NAME
        {
            $$ = [{
                'command' : 'call',
                'value' : $1,
                'params' : [],
                'source' : {
                    'first_line'   : @1.first_line,
                    'first_column' : @1.first_column,
                    'last_line'   : @1.last_line,
                    'last_column' : @1.last_column
                }
            }];
        }
        | NAME '(' callparams ')'
        {
            $$ = [{
                'command' : 'call',
                'value' : $1,
                'params' : $3,
                'source' : {
                    'first_line'   : @1.first_line,
                    'first_column' : @1.first_column,
                    'last_line'   : @4.last_line,
                    'last_column' : @4.last_column
                }
            }];
        }
        | PUT color
        {
            $$ = [{
                'command' : 'put',
                'value' : $2,
                'source' : {
                    'first_line'   : @1.first_line,
                    'first_column' : @1.first_column,
                    'last_line'   : @2.last_line,
                    'last_column' : @2.last_column
                }
            }];
        }       
        | '{' commands '}'
        {
            $$ = $2;
        }        
;

simplecommand : STEP
              { 
                 $$ = 'step'; 
              }
              | TURN
              { 
                 $$ = 'turn'; 
              }
              | PICK
              { 
                 $$ = 'pick'; 
              }
              | TURNOFF SELF
              { 
                 $$ = 'turn-off'; 
              }
              | RETURN SELF
              { 
                 $$ = 'return'; 
              }
;

callparams : /* */
           {
                $$ = [];
           }
           | callparams1
           {
                $$ = $1;
           }

;

callparams1 : callparams1 ',' expression
            {
                $$ = $1;
                $$.push({type:'number', value:$3})
            }
            | callparams1 ',' color
            {
                $$ = $1;
                $$.push({type:'color', value:$3})
            }
            | callparams1 ',' condition
            {
                $$ = $1;
                $$.push({type:'bool', value:$3})
            }
            | callparams1 ',' rotation
            {
                $$ = $1;
                $$.push({type:'rotation', value:$3})
            }
            | expression
            {
                $$ = [{type:'number', value:$1}];
            }
            | color
            {
                $$ = [{type:'color', value:$1}];
            }
            | condition
            {
                $$ = [{type:'bool', value:$1}];
            }
            | rotation
            {
                $$ = [{type:'rotation', value:$1}];
            }
;

/* ASSIGNING VARIABLES */
        
colorvarassign : COLORNAME ASSIGN color
               {
                    $$ = {
                        'command':'assign-color',
                        'name':$1.toLowerCase(),
                        'value':$3,
                        'global':false,
                        'source' : {
                            'first_line'   : @1.first_line,
                            'first_column' : @1.first_column,
                            'last_line'   : @3.last_line,
                            'last_column' : @3.last_column
                        }
                    };
               }
;

numvarassign : NUMBERNAME ASSIGN expression
             {
                    $$ = {
                        'command':'assign-number',
                        'name':$1.toLowerCase(),
                        'value':$3,
                        'global':false,
                        'source' : {
                            'first_line'   : @1.first_line,
                            'first_column' : @1.first_column,
                            'last_line'   : @3.last_line,
                            'last_column' : @3.last_column
                        }
                    };
             }
; 

boolvarassign : BOOLNAME ASSIGN condition
             {
                    $$ = {
                        'command':'assign-bool',
                        'name':$1.toLowerCase(),
                        'value':$3,
                        'global':false,
                        'source' : {
                            'first_line'   : @1.first_line,
                            'first_column' : @1.first_column,
                            'last_line'   : @3.last_line,
                            'last_column' : @3.last_column
                        }
                    };
             }
; 

rotationvarassign : ROTATIONNAME ASSIGN rotation
              {
                    $$ = {
                        'command':'assign-rotation',
                        'name':$1.toLowerCase(),
                        'value':$3,
                        'global':false,
                        'source' : {
                            'first_line'   : @1.first_line,
                            'first_column' : @1.first_column,
                            'last_line'   : @3.last_line,
                            'last_column' : @3.last_column
                        }
                    };
             }
; 

expression : NUMBER
           {
                $$ = function(env) {
                    return Number($1);
                };
           }
           | expression '+' expression
           {
                $$ = function(env) { 
                    return $1(env) + $3(env);
                };
           }
           | expression '-' expression
           {
                $$ = function(env) { 
                    return $1(env) - $3(env);
                };
           }
           | expression '*' expression
           {
                $$ = function(env) { 
                    return $1(env) * $3(env);
                };
           }
           | expression DIV expression
           {
                $$ = function(env) { 
                    return $1(env) / $3(env);
                };
           }
           | expression '%' expression
           {
                $$ = function(env) { 
                    return $1(env) % $3(env);
                };
           }
           | ABS expression ABS
           { 
                $$ = function(world) { 
                    return Math.abs($2(world));
                }; 
           }
           | '-' expression %prec MINUS
           {
                $$ = function(env) { 
                    return - $2(env);
                };
           }
           | '(' expression ')'
           {
                $$ = $2;
           }
           | HEIGHT 
           {
                $$ = function(env) { 
                    return env.height();
                };
           }
           | NUMBERNAME
           {
                $$ = function(env) { 
                    return env.getVarNumber($1.toLowerCase());
                };
           }
           | GLOBAL NUMBERNAME
           {
                $$ = function(env) { 
                    return env.getGlobalVarNumber($2.toLowerCase());
                };
           }
;

/* CONDITIONS */
condition : TRUE
          {
              $$ = function(env) { 
                return true; 
              };
          }
          | FALSE
          {
              $$ = function(env) { 
                return false; 
              };
          }
          | IS HOLE 
          {
              $$ = function(env) { 
                return env.isHole(); 
              };
          }
          | IS CLIFF 
          {
              $$ = function(env) { 
                return env.isCliff(); 
              };
          }
          | IS WALL 
          {
              $$ = function(env) { 
                return env.isWall(); 
              };
          }
          | IS FREE 
          {
              $$ = function(env) { 
                return env.isFree(); 
              };
          }
          | IS BRICK 
          {
              $$ = function(env) { 
                return env.isBrick(); 
              };
          }
          | IS color
          {
              $$ = function(env) { 
                return env.isColor($2); 
              };
          }
          | HAS BRICK 
          {
              $$ = function(env) { 
                return env.hasBrick(); 
              };
          }
          | FACING rotation 
          {
              $$ = function(env) { 
                return env.facing($2); 
              };
          }
          | HAS color 
          {
              $$ = function(env) { 
                return env.hasColor($2); 
              };
          }
          | NOTHAS color 
          {
              $$ = function(env) { 
                return !env.hasColor($2); 
              };
          }
          | condition AND condition
          {
              $$ = function(env) { 
                return ($1(env) && $3(env)); 
              };
          }
          | condition OR condition
          {
              $$ = function(env) { 
                return ($1(env) || $3(env)); 
              };
          }      
          | NOT condition
          {
              $$ = function(env) { 
                return !($2(env)); 
              };
          }
          | expression '<' expression
          {
              $$ = function(env) { 
                return ($1(env) < $3(env)); 
              };
          }
          | expression '>' expression
          {
              $$ = function(env) { 
                return ($1(env) > $3(env)); 
              };
          }
          | expression LT expression
          {
              $$ = function(env) { 
                return ($1(env) <= $3(env)); 
              };
          }
          | expression MT expression
          {
              $$ = function(env) { 
                return ($1(env) >= $3(env)); 
              };
          }
          | color EQUALS color
          {
              $$ = function(env) { 
                return ($1(env) == $3(env)); 
              };
          }
          | color NOTEQUALS color
          {
              $$ = function(env) { 
                return ($1(env) != $3(env)); 
              };
          }
          | expression EQUALS expression
          {
              $$ = function(env) { 
                return ($1(env) == $3(env)); 
              };
          }
          | expression NOTEQUALS expression
          {
              $$ = function(env) { 
                return ($1(env) != $3(env)); 
              };
          }
          | condition EQUALS condition
          {
              $$ = function(env) { 
                return ($1(env) == $3(env)); 
              };
          }
          | condition NOTEQUALS condition
          {
              $$ = function(env) { 
                return ($1(env) != $3(env)); 
              };
          }
          | rotation EQUALS rotation
          {
              $$ = function(env) { 
                return ($1(env) == $3(env)); 
              };
          }
          | rotation NOTEQUALS rotation
          {
              $$ = function(env) {
                return ($1(env) != $3(env)); 
              };
          }
          | BOOLNAME
          {
              $$ = function(env) { 
                return env.getVarBool($1.toLowerCase());
              };
          }
          | GLOBAL BOOLNAME
          {
              $$ = function(env) { 
                return env.getGlobalVarBool($2.toLowerCase());
              };
          }
          | '(' condition ')'
           {
                $$ = $2;
           }
;

/* COLOR */
                
color : COLOR
      {
            $$ = function(env) { 
                return yytext; 
            };
      }
      | COLORNAME
      {
          $$ = function(env) { 
            return env.getVarColor($1.toLowerCase());
          };
      }
      | GLOBAL COLORNAME
      {
          $$ = function(env) { 
            return env.getGlobalVarColor($2.toLowerCase());
          };
      }
;

rotation : ROTATIONNAME
         {
             $$ = function(env) { 
                return env.getVarRotation($1.toLowerCase());
             };
         }
         | GLOBAL ROTATIONNAME
         {
             $$ = function(env) { 
                return env.getGlobalVarRotation($2.toLowerCase());
             };
         }
         | RIGHT 
         {
            $$ = function(env) { 
                return 0;
            };
         }
         | UP 
         {
            $$ = function(env) { 
                return 1;
            };
         }
         | LEFT 
         {
            $$ = function(env) { 
                return 2;
            };
         }
         | DOWN 
         {
            $$ = function(env) { 
                return 3;
            };
         }
;