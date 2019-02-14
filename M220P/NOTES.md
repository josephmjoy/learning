Course Notes for M220P
#January 13, 2019A JMJ: Setting up the environment


Set up the virtual environement, using `py -venv` instead of `virtualenv ...` suggested
in <ttps://university.mongodb.com/mercury/M220P/2019_February/chapter/Chapter_1_Driver_Setup/lesson/5b801142b9a6284ac1334d9c/tab/5b801142b9a6284ac1334da3>
because `-pvenv` is built into Python now.

```
$ py -m venv ./mflix-venv
jmj@JMJ-EliteBook MINGW64 ~/Documents/GitHub/learning/M220P/mflix-python (master)
$ cd mflix-venv
$ cd Scripts/
$ source activate
(mflix-venv)
jmj@JMJ-EliteBook MINGW64 ~/Documents/GitHub/learning/M220P/mflix-python/mflix-venv/Scripts (master)
```
Note the `(mflix-venv)` addition to the prompt - nice!


