---
layout: post
title:  "Is AI the Future of Game Design?"
date:   2023-03-07 17:44:32 -0800
categories: First Game
---
It's a quiet saturday and I'm studying for an upcoming test. As I survey the study lounge that is my home until the clock strikes eleven, I note the usual types -- anxious procrastinators making up for lost time, socializers pretending to study, snackers that never seem to stop their chewing -- but something feels off, a foreboding feeling saturates the room. My worries are actualized with a slight ping -- a text from my girlfriend professing her excitement at the gift she's gotten me for Valentines day. Horror engulfs me. How could I have forgotten, Valentine's is only four days away and I have no gift at the ready. 


While I know this sounds like the start to a poorly made sitcom filled with wacky antics, misplaced girlfriends and overdone tropes, it was actually the beginning of an interesting, and in my opinion astounding, journey. As I was mulling over the various cliche gifts I would have enough time to procure before that tuesday, a small, yet bright, lightbulb went off in my head. What if I made her a game? This is something I had wanted to do for a while, both to profess my affection and to further my skills as a Game Designer. But I had been putting it off for a while. So I started. However, as anyone with a mild inclination towards making games knows it is can be a painstaking and long process, especially if you are inexperienced and need to constantly utilize Stack Exchange and whatever else google can provide you. This however was a high-stakes mission and I had limited time at my disposal. So I turned to ChatGPT which I had used successfully for advice in everything from coding, to debugging, to ordering gameobjects. This was the true beginning of my foray into the world of Artificial Intelligence aided Game Design.


I had decided to make an infinite 'flyer.', Cupid's Arrow as I would come to call it. First and foremost I had to make my protaganist move. Of course ChatGPT was my very first source. The majority of this code was directly quoted from the chatbot. Throughout the creation process, I had to ask a variety of questions and piece together what I learned as well as the code provided.

{% highlight ruby %}
public class PlayerController : MonoBehaviour
{
    public float moveSpeed = 5f;

    private Rigidbody2D rb;
    private float minX, maxX, minY, maxY;
    public int health = 5;

    public GameObject bulletPrefab;
    public float bulletSpeed = 10f;
    [SerializeField] public float bulletTimer;

    public BulletBar bulletBar;
    public HealthBar healthBar;

    public PauseScript pauseScript;
    public GameObject gameOverPrefab;

    private void Start()
    {
        rb = GetComponent<Rigidbody2D>();
        Camera mainCamera = Camera.main;
        Vector2 screenBounds = mainCamera.ScreenToWorldPoint(new Vector3(Screen.width, Screen.height, mainCamera.transform.position.z));
        minX = -screenBounds.x + transform.localScale.x / 2;
        maxX = screenBounds.x - transform.localScale.x / 2;
        minY = -screenBounds.y + transform.localScale.y / 2;
        maxY = screenBounds.y - transform.localScale.y / 2;

        pauseScript = GameObject.Find("GameController").GetComponent<PauseScript>();
    }

    private void Update()
    {
        float horizontal = Input.GetAxis("Horizontal");
        float vertical = Input.GetAxis("Vertical");

        Vector2 movement = new Vector2(horizontal, vertical);

        // Clamp the position to the screen bounds
        Vector3 newPosition = transform.position + (Vector3)movement * moveSpeed * Time.deltaTime;
        newPosition.x = Mathf.Clamp(newPosition.x, minX, maxX);
        newPosition.y = Mathf.Clamp(newPosition.y, minY, maxY);
        transform.position = newPosition;

        rb.velocity = Vector2.zero;

        // Point at pointer
        Vector3 mousePosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        Vector2 direction = mousePosition - transform.position;
        transform.up = direction;

        // Bullet velocity
        if ((Input.GetMouseButtonDown(0)) && ( bulletTimer <= 0f))
        {
            GameObject newBullet = Instantiate(bulletPrefab, transform.position, Quaternion.identity);
            Rigidbody2D bulletRigidbody = newBullet.GetComponent<Rigidbody2D>();
            bulletRigidbody.velocity = direction.normalized * bulletSpeed;
            bulletTimer = 1f;
        }
        if (bulletTimer > 0f)
        {
            bulletTimer -= Time.deltaTime;
        }
        bulletBar.SetBulletBar(bulletTimer);


    }
    void OnTriggerEnter2D(Collider2D other)
    {
        // Check if the other GameObject is an enemy
        if (other.gameObject.CompareTag("Enemy"))
        {
            health -= 1;
            healthBar.SetHealthBar(health);
            Destroy(other.gameObject);
            if(health <= 0)
            {
                pauseScript.PauseGame();
                GameObject gameOver = Instantiate(gameOverPrefab);
            }
        }
    }
}
{% endhighlight %}

This exact code can be found on my github, or right [here][Cupid-Repo]. Then I had to constrain my player within the boundaries of the screen.  This was the response given by ChatGPT when asked, `How would I limit the player to the boundaries of the screen?` 

<img src="/assets/bounds1.png">

This snippet of code was one of the first, of many, mind-blowing moments as it worked perfectly as soon as I copy-pasted it into my script file. Go try this out yourself. You won't get the same answer as me, but I guarantee it will be one that can be implemented in a Unity game. 

While these were relatively widespread game mechanics that could be found in almost all starter Unity games, ChatGPT was able to help me with the not-so general stuff too. In order for my vision to work I needed a way for my enemy sprites to spawn, get across the screen. and then delete themselves. This was one of the harder parts. While I remembered making a despawner box from the previous quarter, I had forgotten the exact steps. So I asked ChatGPT.

<img src="/assets/despawner1.png"> 

Although this was all useful information which helped jog my caffeine-addled college brain, I needed a bit more. So I asked for specifics.

<img src="/assets/despawnerr2.png"> 

After getting the exact code and applying it to my quickly expanding game, I tested the despawner. Unfortunately it didn't work, usually this would mean a long search involving google, stack exchange, discord and whatever else I could get my hands on. But why would I do that when GPT-3 was right there at my disposal? A simple question later, as well as some testing and my issues were solved.

<img src="/assets/despawner3.png"> 

This part truly bedazzled me. Because usually going through the ardous process of finding a stack exchange post that was related to my issue was in itself demoralising, and thats discounting actually fixing the problem itself. I was able to ask a simple question and get a simple response that was, almost, completely related to my query. And so, in no time my despawner was working perfectly well.

Now, I didn't just use AI to help code my game, no, I went further than that. The main antagonist -- of course coded with the help of ChatGPT -- was a brand new image sourced from [Scenario.gg][Scenario.gg]. Scenario is a stable diffusion model that allows the user to create a generator, which is filled with similar images chosen by the user that are synthesized into a personal image creator which accepts prompts and images. I used a generator that was previously created by a user, the little robots generator. 

<img src="/assets/robotgen.png" height="226" width="219"> 

The prompt I used was `Little Robots, Evil robot, Flying, wings`, which generated this little guy.

<img src="/assets/enemy.png" height="225" width="225"> 

After playing around with transparency and alpha channels in gimp, my antagonist was born. Then I thought it might be nice to include the person this was all about, my girlfriend. So I used the Anime Portraits generator, and inputted an image of my girlfriend as a reference for the AI. 

<img src="/assets/generator1.png"> <img src="/assets/animegf.png" height="170" width="229"> <img src="/assets/jj.png" height="343" width="257">   

This image can be seen as the background for the main menu in the game. I was able to, with the help of AI, do the job of an artist myself. Artifical Intelligence, with my guidance and implementation, truly built this game. In fact, ChatGPT even helped me write this blog. The AIs answer to my asking for critique of the blog post:

<img src="/assets/blogcorrection2.png"> 

After all of this prompting and implementing I was able to create a fully functional game that was even somewhat fun to play. And just in time for Valentines day.


But, its not all rainbows and sunshine. ChatGPT has its fair share of issues. Asking it more complex questions often yields meager and chaotic results. And furthermore, the code it provides is not always foolproof, which can lead to some infuriating moments. For example while working on another game, ChatGPT provided me with defunct code that had been fazed out with a newer version of Unity. Or, when asked to create a script that allows for certain objects to be deactivated then reactivated, the AI failed to account for the fact that when a GameObject is deactivated in its entirety, you cannot refer to it by its tag. Thus, you have no way of reactivating it. And this is only talking about ChatGPT; the amount of times I was forced to regenerate images for Cupid's Rocket because of lacking or disturbing outcomes was more than significant. This however, is an adolescent stage of Artificial Intelligence. And these issues will assuredly fade. As this technology develops, whatever I was shocked by in this blog will surely become commonplace. Coding projects that were once the domain of well-payed professionals may become no more than a click away. And while this game is relatively basic, which may reflect both my novelty and the relative infancy of artificial intelligence, it is still, in my opinion a truly awe-inspiring glance into the future of game design and by extension of the world.









[Cupid-Repo]: https://github.com/Elijahtab/Cupids-Rocket
[Scenario.gg]: https://www.scenario.com/


