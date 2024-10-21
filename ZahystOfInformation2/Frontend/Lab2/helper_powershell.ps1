function Get-ChildProcesses ($ParentProcessId) {
    $filter = "parentprocessid = '$($ParentProcessId)'"
    Get-CIMInstance -ClassName win32_process -filter $filter | Foreach-Object {
            $_
            if ($_.ParentProcessId -ne $_.ProcessId) {
                Get-ChildProcesses $_.ProcessId
            }
        }
}

function Get-ParentProcess ($ProcessId) {
    $process = Get-CimInstance -ClassName win32_process -Filter "ProcessId = '$($ProcessId)'"
    
    if ($process) {
        $parentProcessId = $process.ParentProcessId
        
        $parentProcess = Get-CimInstance -ClassName win32_process -Filter "ProcessId = '$($parentProcessId)'"
        $parentProcess
        
        if ($parentProcessId -ne $process.ProcessId -and $parentProcessId -ne 0) {
            Get-ParentProcess $parentProcessId
        }
    } else {
        Write-Host "Process with ID $ProcessId not found."
    }
}


# Get-ParentProcess 12072 | Select ProcessId, Name, ParentProcessId

Get-ChildProcesses 6416