import resource
import subprocess
import sys
import json
from math import ceil

def limit_resources(timelimit, memorylimit):
    resource.setrlimit(resource.RLIMIT_CPU, (timelimit + 1, timelimit + 1))
    resource.setrlimit(resource.RLIMIT_AS, (memorylimit, memorylimit))

cwd, timelimit, memorylimit, input_path = sys.argv[1:5]
run_cmd = " ".join(sys.argv[5:len(sys.argv)])
IN = open(input_path, 'r').read()
timelimit = float(timelimit)
memorylimit = int(memorylimit)

p = subprocess.Popen(run_cmd, shell=True, preexec_fn=limit_resources(ceil(timelimit), memorylimit),
                     stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, encoding='utf-8', cwd=cwd)

(out, err) = p.communicate(input=IN)

msg = {}
usage = resource.getrusage(resource.RUSAGE_CHILDREN)

msg['time'] = usage.ru_utime
msg['memory'] = usage.ru_maxrss 
msg['output'] = out 

if p.returncode == 0:
    if timelimit - usage.ru_utime >= 0.01:
        msg['verdict'] = 'okay'
    elif usage.ru_utime <= 1.25 * timelimit:
        msg['verdict'] = 'tle close'
    else:
        msg['verdict'] = 'tle'
elif usage.ru_utime - timelimit > 0.01:
    msg['verdict'] = 'tle'
elif p.returncode == 134:
    msg['verdict'] = 'mle'
elif p.returncode == 139:
    if 'core dumped' not in err:
        msg['verdict'] = 'mle'
    else:
        msg['verdict'] = 'rte'
else:
    msg['verdict'] = 'rte'

msg['err'] = err
msg['returncode'] = p.returncode

print(json.dumps(msg))

