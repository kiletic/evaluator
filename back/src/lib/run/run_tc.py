import resource
import subprocess
import sys
import json

def limit_resources(timelimit, memorylimit):
    resource.setrlimit(resource.RLIMIT_CPU, (timelimit, timelimit))
    resource.setrlimit(resource.RLIMIT_AS, (memorylimit, memorylimit))

cwd, timelimit, memorylimit, input_path = sys.argv[1:5]
run_cmd = " ".join(sys.argv[5:len(sys.argv)])
IN = open(input_path, 'r').read()

p = subprocess.Popen(run_cmd, shell=True, preexec_fn=limit_resources(int(timelimit), int(memorylimit)),
                     stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, encoding='utf-8', cwd=cwd)

(out, err) = p.communicate(input=IN)

msg = {}
usage = resource.getrusage(resource.RUSAGE_CHILDREN)

msg['time'] = usage.ru_utime
msg['memory'] = usage.ru_maxrss
msg['output'] = out

if p.returncode == 0:
    msg['verdict'] = 'okay'
elif abs(usage.ru_utime - float(timelimit)) < 0.01:
    msg['verdict'] = 'tle'
elif p.returncode == 134:
    msg['verdict'] = 'mle'
elif p.returncode == 139:
    if 'core dumped' not in err:
        msg['verdict'] = 'mle'
    else:
        msg['verdict'] = 'rte'
else:
    msg['verdict'] = 'unknown'

print(json.dumps(msg))
