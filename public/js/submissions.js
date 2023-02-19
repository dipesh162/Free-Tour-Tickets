
function call(btnIndex, user, uploadId, tourIndex, event){

    $($('.shortlist-btn')[btnIndex]).html('ShortListing')
    $($('.shortlist-btn')[btnIndex]).prop('disabled', true)
    
    fetch(
        `/test`, 
        {
            method: 'post',
            headers: {
                'Content-Type': 
                    'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                user,
                uploadId,
                tourIndex,
                event
            })
        },
    )
    .then((res) => {
            if(res.ok){
                $($('.shortlist-btn')[btnIndex]).toggleClass("shortlist-btn-disabled").html('ShortListed')
                return res
            }

            throw new Error('Something went wrong.');
    })
    .catch((error) =>{
        $($('.shortlist-btn')[btnIndex]).prop('disabled', false)
        $($('.shortlist-btn')[btnIndex]).html('ShortList')
        console.error('Error:', error);
    })
}

