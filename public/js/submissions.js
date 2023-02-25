$(".shortlist-btn").on('click', function() {

    $(this).html('ShortListing')
    $(this).prop('disabled', true)

    let user = $(this).attr('data-user')
    let uploadId = $(this).attr('data-upload-id')
    let tourIndex = $(this).attr('data-tour-index')
    let event = $(this).attr('data-event')

    fetch(
        `/shortlist-upload`, 
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
                $(this).toggleClass("shortlist-btn-disabled").html('ShortListed')
                return res
            }

            throw new Error('Something went wrong.');
    })
    .catch((error) =>{
        $(this).prop('disabled', false)
        $(this).html('ShortList')
        console.error('Error:', error);
    })
});

